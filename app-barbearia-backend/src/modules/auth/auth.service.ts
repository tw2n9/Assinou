import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool, query } from "../../database/pool";
import { env } from "../../config/env";
import type { AuthUser, UserRole } from "../../types/user";
import { HttpError } from "../../utils/http-error";

type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type RegisterBarberInput = RegisterInput & {
  publicName: string;
  specialty?: string | null;
};

type RegisterOwnerInput = RegisterInput & {
  barbershopName: string;
  city: string;
  state: string;
  address?: string | null;
  barbershopPhone?: string | null;
};

type LoginInput = {
  email: string;
  password: string;
};

function signToken(user: { id: string; role: UserRole }) {
  const options: jwt.SignOptions = {
    subject: user.id,
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"]
  };

  return jwt.sign({ role: user.role }, env.jwtSecret as jwt.Secret, options);
}

function toPublicUser(user: AuthUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
}

export async function register(input: RegisterInput) {
  const existing = await query("SELECT id FROM users WHERE email = $1", [input.email]);

  if (existing.rowCount) {
    throw new HttpError(409, "USER_EMAIL_ALREADY_EXISTS", "E-mail ja cadastrado");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const userResult = await query<AuthUser>(
    `INSERT INTO users (name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, 'client')
     RETURNING id, name, email, phone, role, is_active`,
    [input.name, input.email, input.phone, passwordHash]
  );

  const user = userResult.rows[0];

  await query("INSERT INTO clients (user_id) VALUES ($1)", [user.id]);

  return {
    user: toPublicUser(user),
    token: signToken(user)
  };
}

export async function registerBarber(input: RegisterBarberInput) {
  const existing = await query("SELECT id FROM users WHERE email = $1", [input.email]);

  if (existing.rowCount) {
    throw new HttpError(409, "USER_EMAIL_ALREADY_EXISTS", "E-mail ja cadastrado");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const userResult = await query<AuthUser>(
    `INSERT INTO users (name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, 'barber')
     RETURNING id, name, email, phone, role, is_active`,
    [input.name, input.email, input.phone, passwordHash]
  );

  const user = userResult.rows[0];

  await query(
    `INSERT INTO barbers (barbershop_id, user_id, public_name, specialty, is_active)
     VALUES ((SELECT id FROM barbershops ORDER BY created_at LIMIT 1), $1, $2, $3, true)`,
    [user.id, input.publicName, input.specialty ?? null]
  );

  return {
    user: toPublicUser(user),
    token: signToken(user)
  };
}

export async function registerOwner(input: RegisterOwnerInput) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const databaseQuery = <T extends Record<string, unknown>>(sql: string, params: unknown[] = []) => client.query<T>(sql, params);

    const existing = await databaseQuery("SELECT id FROM users WHERE email = $1", [input.email]);
    if (existing.rowCount) {
      throw new HttpError(409, "USER_EMAIL_ALREADY_EXISTS", "E-mail ja cadastrado");
    }

    const barbershopResult = await databaseQuery<{ id: string }>(
      `INSERT INTO barbershops (name, city, state, address, phone, is_active)
       VALUES ($1, $2, upper($3), $4, $5, true)
       RETURNING id`,
      [
        input.barbershopName,
        input.city,
        input.state,
        input.address ?? null,
        input.barbershopPhone ?? input.phone
      ]
    );
    const barbershopId = barbershopResult.rows[0].id;

    await databaseQuery(
      `INSERT INTO settings (barbershop_id, business_name, phone, address, cancellation_limit_minutes, default_slot_interval_minutes, cancellation_policy_text)
       VALUES ($1, $2, $3, $4, 120, 30, 'Cancelamentos permitidos ate 2 horas antes do horario.')`,
      [barbershopId, input.barbershopName, input.barbershopPhone ?? input.phone, input.address ?? null]
    );

    for (const weekday of [1, 2, 3, 4, 5, 6]) {
      await databaseQuery(
        `INSERT INTO business_hours (barbershop_id, weekday, opens_at, closes_at, is_active)
         VALUES ($1, $2, '09:00', '19:00', true)`,
        [barbershopId, weekday]
      );
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const userResult = await databaseQuery<AuthUser>(
      `INSERT INTO users (barbershop_id, name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, 'admin')
       RETURNING id, name, email, phone, role, is_active`,
      [barbershopId, input.name, input.email, input.phone, passwordHash]
    );

    await client.query("COMMIT");

    const user = userResult.rows[0];
    return {
      user: toPublicUser(user),
      token: signToken(user),
      barbershopId
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function login(input: LoginInput) {
  const result = await query<AuthUser & { password_hash: string }>(
    "SELECT id, name, email, phone, password_hash, role, is_active FROM users WHERE email = $1",
    [input.email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new HttpError(401, "AUTH_INVALID_CREDENTIALS", "Credenciais invalidas");
  }

  if (!user.is_active) {
    throw new HttpError(403, "AUTH_USER_INACTIVE", "Usuario inativo");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password_hash);

  if (!passwordMatches) {
    throw new HttpError(401, "AUTH_INVALID_CREDENTIALS", "Credenciais invalidas");
  }

  return {
    user: toPublicUser(user),
    token: signToken(user)
  };
}
