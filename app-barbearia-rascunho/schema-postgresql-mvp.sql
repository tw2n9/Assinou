-- Schema PostgreSQL do MVP - Aplicativo de Barbearia
-- Base inicial para migrations do backend.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

CREATE TABLE IF NOT EXISTS barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  public_name VARCHAR(120) NOT NULL,
  specialty VARCHAR(160) NULL,
  photo_url TEXT NULL,
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
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_barbers_active ON barbers(is_active);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);
CREATE INDEX IF NOT EXISTS idx_barber_working_hours_barber ON barber_working_hours(barber_id);
CREATE INDEX IF NOT EXISTS idx_barber_working_hours_barber_weekday ON barber_working_hours(barber_id, weekday);
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_barber_date ON schedule_blocks(barber_id, date);
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_date ON schedule_blocks(date);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_barber ON bookings(barber_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_barber_date ON bookings(barber_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_barber_date_time ON bookings(barber_id, date, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_channel ON notifications(channel);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Evita dois settings ativos por convencao do MVP via uso operacional.
-- Futuramente, para multiunidade, criar tabela barber_shops e relacionar settings por unidade.

INSERT INTO settings (
  business_name,
  cancellation_limit_minutes,
  default_slot_interval_minutes,
  cancellation_policy_text
)
SELECT
  'Nome da Barbearia',
  120,
  30,
  'Cancelamentos permitidos ate 2 horas antes do horario.'
WHERE NOT EXISTS (SELECT 1 FROM settings);

INSERT INTO services (name, description, price, duration_minutes, is_active)
SELECT 'Corte', 'Corte masculino', 50.00, 30, true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Corte');

INSERT INTO services (name, description, price, duration_minutes, is_active)
SELECT 'Barba', 'Modelagem de barba', 40.00, 30, true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Barba');

INSERT INTO services (name, description, price, duration_minutes, is_active)
SELECT 'Sobrancelha', 'Design de sobrancelha', 25.00, 20, true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Sobrancelha');

INSERT INTO services (name, description, price, duration_minutes, is_active)
SELECT 'Pigmentacao', 'Pigmentacao capilar ou barba', 70.00, 45, true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Pigmentacao');

INSERT INTO services (name, description, price, duration_minutes, is_active)
SELECT 'Hidratacao', 'Hidratacao capilar', 45.00, 30, true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Hidratacao');

INSERT INTO services (name, description, price, duration_minutes, is_active)
SELECT 'Combo Corte + Barba', 'Corte masculino com barba', 85.00, 60, true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Combo Corte + Barba');
