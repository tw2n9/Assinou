import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { query } from "../../database/pool";
import { requireAuth, requireRole } from "../../middleware/auth";
import { asyncHandler } from "../../utils/async-handler";
import { HttpError } from "../../utils/http-error";

export const barberRoutes = Router();

const createBarberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
  publicName: z.string().min(2),
  specialty: z.string().optional().nullable(),
  isActive: z.boolean().optional()
});

const updateBarberSchema = z.object({
  publicName: z.string().min(2).optional(),
  specialty: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  defaultServiceDurationMinutes: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional()
});

barberRoutes.use(requireAuth);

barberRoutes.get("/me", requireRole("barber"), asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, public_name AS "publicName", specialty, photo_url AS "photoUrl",
            default_service_duration_minutes AS "defaultServiceDurationMinutes",
            is_active AS "isActive"
     FROM barbers
     WHERE user_id = $1`,
    [req.user!.id]
  );

  if (!result.rows[0]) throw new HttpError(404, "BARBER_NOT_FOUND", "Barbeiro nao encontrado");
  res.json({ data: result.rows[0] });
}));

barberRoutes.patch("/me", requireRole("barber"), asyncHandler(async (req, res) => {
  const payload = updateBarberSchema.pick({
    publicName: true,
    specialty: true,
    photoUrl: true,
    defaultServiceDurationMinutes: true
  }).parse(req.body);

  const result = await query(
    `UPDATE barbers
     SET public_name = COALESCE($1, public_name),
         specialty = COALESCE($2, specialty),
         photo_url = COALESCE($3, photo_url),
         default_service_duration_minutes = COALESCE($4, default_service_duration_minutes),
         updated_at = now()
     WHERE user_id = $5
     RETURNING id, public_name AS "publicName", specialty, photo_url AS "photoUrl",
               default_service_duration_minutes AS "defaultServiceDurationMinutes",
               is_active AS "isActive"`,
    [
      payload.publicName,
      payload.specialty,
      payload.photoUrl,
      payload.defaultServiceDurationMinutes,
      req.user!.id
    ]
  );

  if (!result.rows[0]) throw new HttpError(404, "BARBER_NOT_FOUND", "Barbeiro nao encontrado");
  res.json({ data: result.rows[0], message: "Perfil de barbeiro atualizado" });
}));

barberRoutes.get("/", asyncHandler(async (req, res) => {
  const includeInactive = req.user!.role === "admin" && req.query.includeInactive === "true";
  const barbershopId = typeof req.query.barbershopId === "string" ? req.query.barbershopId : null;
  const result = await query(
    `SELECT id, public_name AS "publicName", specialty, photo_url AS "photoUrl",
            default_service_duration_minutes AS "defaultServiceDurationMinutes",
            is_active AS "isActive"
     FROM barbers
     WHERE ($1::boolean = true OR is_active = true)
       AND ($2::uuid IS NULL OR barbershop_id = $2)
     ORDER BY public_name`,
    [includeInactive, barbershopId]
  );
  res.json({ data: result.rows });
}));

barberRoutes.post("/", requireRole("admin"), asyncHandler(async (req, res) => {
  const payload = createBarberSchema.parse(req.body);
  const existing = await query("SELECT id FROM users WHERE email = $1", [payload.email]);
  if (existing.rowCount) throw new HttpError(409, "USER_EMAIL_ALREADY_EXISTS", "E-mail ja cadastrado");

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const userResult = await query<{ id: string }>(
    `INSERT INTO users (name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, 'barber')
     RETURNING id`,
    [payload.name, payload.email, payload.phone, passwordHash]
  );

  const result = await query(
    `INSERT INTO barbers (barbershop_id, user_id, public_name, specialty, is_active)
     VALUES (
       COALESCE((SELECT barbershop_id FROM users WHERE id = $1), (SELECT id FROM barbershops ORDER BY created_at LIMIT 1)),
       $2, $3, $4, $5
     )
     RETURNING id, user_id AS "userId", public_name AS "publicName", specialty, photo_url AS "photoUrl",
               default_service_duration_minutes AS "defaultServiceDurationMinutes",
               is_active AS "isActive"`,
    [req.user!.id, userResult.rows[0].id, payload.publicName, payload.specialty ?? null, payload.isActive ?? true]
  );

  res.status(201).json({ data: result.rows[0], message: "Barbeiro criado" });
}));

barberRoutes.patch("/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const payload = updateBarberSchema.parse(req.body);
  const result = await query(
    `UPDATE barbers
     SET public_name = COALESCE($1, public_name),
         specialty = COALESCE($2, specialty),
         photo_url = COALESCE($3, photo_url),
         is_active = COALESCE($4, is_active),
         updated_at = now()
     WHERE id = $5
     RETURNING id, public_name AS "publicName", specialty, photo_url AS "photoUrl", is_active AS "isActive"`,
    [payload.publicName, payload.specialty, payload.photoUrl, payload.isActive, req.params.id]
  );
  if (!result.rows[0]) throw new HttpError(404, "BARBER_NOT_FOUND", "Barbeiro nao encontrado");
  res.json({ data: result.rows[0], message: "Barbeiro atualizado" });
}));

barberRoutes.delete("/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const result = await query(
    `UPDATE barbers SET is_active = false, updated_at = now()
     WHERE id = $1
     RETURNING id, public_name AS "publicName", specialty, photo_url AS "photoUrl", is_active AS "isActive"`,
    [req.params.id]
  );
  if (!result.rows[0]) throw new HttpError(404, "BARBER_NOT_FOUND", "Barbeiro nao encontrado");
  res.json({ data: result.rows[0], message: "Barbeiro desativado" });
}));
