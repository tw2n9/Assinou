CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('client', 'barber', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('scheduled', 'confirmed', 'completed', 'canceled', 'no_show');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_channel') THEN
    CREATE TYPE notification_channel AS ENUM ('internal', 'email', 'push', 'whatsapp');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_status') THEN
    CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'read', 'failed');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barbershops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  city VARCHAR(120) NOT NULL,
  state VARCHAR(2) NOT NULL,
  address TEXT NULL,
  phone VARCHAR(30) NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  public_name VARCHAR(120) NOT NULL,
  specialty VARCHAR(160) NULL,
  photo_url TEXT NULL,
  default_service_duration_minutes INTEGER NULL CHECK (default_service_duration_minutes IS NULL OR default_service_duration_minutes > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday INTEGER NOT NULL UNIQUE CHECK (weekday >= 0 AND weekday <= 6),
  opens_at TIME NOT NULL,
  closes_at TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (opens_at < closes_at)
);

CREATE TABLE IF NOT EXISTS barber_working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID NOT NULL REFERENCES barbers(id),
  weekday INTEGER NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  starts_at TIME NOT NULL,
  ends_at TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (starts_at < ends_at)
);

CREATE TABLE IF NOT EXISTS schedule_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID NULL REFERENCES barbers(id),
  date DATE NOT NULL,
  starts_at TIME NOT NULL,
  ends_at TIME NOT NULL,
  reason VARCHAR(255) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (starts_at < ends_at)
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  barber_id UUID NOT NULL REFERENCES barbers(id),
  service_id UUID NOT NULL REFERENCES services(id),
  date DATE NOT NULL,
  starts_at TIME NOT NULL,
  ends_at TIME NOT NULL,
  status booking_status NOT NULL DEFAULT 'scheduled',
  price_snapshot NUMERIC(10,2) NOT NULL CHECK (price_snapshot >= 0),
  cancel_reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (starts_at < ends_at)
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(80) NOT NULL,
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  channel notification_channel NOT NULL DEFAULT 'internal',
  status notification_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(160) NOT NULL,
  phone VARCHAR(30) NULL,
  address TEXT NULL,
  cancellation_limit_minutes INTEGER NOT NULL DEFAULT 120 CHECK (cancellation_limit_minutes >= 0),
  default_slot_interval_minutes INTEGER NOT NULL DEFAULT 30 CHECK (default_slot_interval_minutes > 0),
  cancellation_policy_text TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_barbers_active ON barbers(is_active);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_barber_date ON bookings(barber_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_barber_date_time ON bookings(barber_id, date, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_barber_working_hours_barber_weekday ON barber_working_hours(barber_id, weekday);
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_barber_date ON schedule_blocks(barber_id, date);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_no_active_overlap'
  ) THEN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_no_active_overlap
      EXCLUDE USING gist (
        barber_id WITH =,
        date WITH =,
        tsrange(date + starts_at, date + ends_at, '[)') WITH &&
      )
      WHERE (status IN ('scheduled', 'confirmed'));
  END IF;
END $$;

INSERT INTO settings (business_name, cancellation_limit_minutes, default_slot_interval_minutes, cancellation_policy_text)
SELECT 'Nome da Barbearia', 120, 30, 'Cancelamentos permitidos ate 2 horas antes do horario.'
WHERE NOT EXISTS (SELECT 1 FROM settings);

INSERT INTO barbershops (name, city, state, address, phone)
SELECT
  COALESCE((SELECT business_name FROM settings ORDER BY created_at LIMIT 1), 'Nome da Barbearia'),
  'Rancharia',
  'SP',
  (SELECT address FROM settings ORDER BY created_at LIMIT 1),
  (SELECT phone FROM settings ORDER BY created_at LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM barbershops);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS barbershop_id UUID NULL REFERENCES barbershops(id);

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS barbershop_id UUID NULL REFERENCES barbershops(id);

ALTER TABLE barbers
  ADD COLUMN IF NOT EXISTS barbershop_id UUID NULL REFERENCES barbershops(id);

ALTER TABLE business_hours
  ADD COLUMN IF NOT EXISTS barbershop_id UUID NULL REFERENCES barbershops(id);

ALTER TABLE schedule_blocks
  ADD COLUMN IF NOT EXISTS barbershop_id UUID NULL REFERENCES barbershops(id);

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS barbershop_id UUID NULL REFERENCES barbershops(id);

ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS barbershop_id UUID NULL REFERENCES barbershops(id);

UPDATE users
SET barbershop_id = (SELECT id FROM barbershops ORDER BY created_at LIMIT 1)
WHERE role IN ('admin', 'barber') AND barbershop_id IS NULL;

UPDATE services
SET barbershop_id = (SELECT id FROM barbershops ORDER BY created_at LIMIT 1)
WHERE barbershop_id IS NULL;

UPDATE barbers
SET barbershop_id = (SELECT id FROM barbershops ORDER BY created_at LIMIT 1)
WHERE barbershop_id IS NULL;

UPDATE business_hours
SET barbershop_id = (SELECT id FROM barbershops ORDER BY created_at LIMIT 1)
WHERE barbershop_id IS NULL;

UPDATE schedule_blocks
SET barbershop_id = COALESCE(
  (SELECT br.barbershop_id FROM barbers br WHERE br.id = schedule_blocks.barber_id),
  (SELECT id FROM barbershops ORDER BY created_at LIMIT 1)
)
WHERE barbershop_id IS NULL;

UPDATE bookings
SET barbershop_id = COALESCE(
  (SELECT br.barbershop_id FROM barbers br WHERE br.id = bookings.barber_id),
  (SELECT id FROM barbershops ORDER BY created_at LIMIT 1)
)
WHERE barbershop_id IS NULL;

UPDATE settings
SET barbershop_id = (SELECT id FROM barbershops ORDER BY created_at LIMIT 1)
WHERE barbershop_id IS NULL;

ALTER TABLE services
  ALTER COLUMN barbershop_id SET NOT NULL;

ALTER TABLE barbers
  ALTER COLUMN barbershop_id SET NOT NULL;

ALTER TABLE business_hours
  ALTER COLUMN barbershop_id SET NOT NULL;

ALTER TABLE schedule_blocks
  ALTER COLUMN barbershop_id SET NOT NULL;

ALTER TABLE bookings
  ALTER COLUMN barbershop_id SET NOT NULL;

ALTER TABLE settings
  ALTER COLUMN barbershop_id SET NOT NULL;

ALTER TABLE business_hours
  DROP CONSTRAINT IF EXISTS business_hours_weekday_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'business_hours_barbershop_weekday_key'
  ) THEN
    ALTER TABLE business_hours
      ADD CONSTRAINT business_hours_barbershop_weekday_key UNIQUE (barbershop_id, weekday);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_barbershop ON users(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_barbershops_city_state ON barbershops(city, state);
CREATE INDEX IF NOT EXISTS idx_barbershops_active ON barbershops(is_active);
CREATE INDEX IF NOT EXISTS idx_barbers_barbershop ON barbers(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_services_barbershop ON services(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_bookings_barbershop ON bookings(barbershop_id);

ALTER TABLE barbers
  ADD COLUMN IF NOT EXISTS default_service_duration_minutes INTEGER NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'barbers_default_service_duration_positive'
  ) THEN
    ALTER TABLE barbers
      ADD CONSTRAINT barbers_default_service_duration_positive
      CHECK (default_service_duration_minutes IS NULL OR default_service_duration_minutes > 0);
  END IF;
END $$;
