import { Router } from "express";
import { z } from "zod";
import { query } from "../../database/pool";
import { requireAuth, requireRole } from "../../middleware/auth";
import { asyncHandler } from "../../utils/async-handler";

export const barbershopRoutes = Router();

const barbershopSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2).max(2),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  isActive: z.boolean().optional()
});

barbershopRoutes.use(requireAuth);

barbershopRoutes.get("/", asyncHandler(async (req, res) => {
  const city = typeof req.query.city === "string" ? req.query.city.trim() : "";
  const state = typeof req.query.state === "string" ? req.query.state.trim().toUpperCase() : "";
  const includeInactive = req.user!.role === "admin" && req.query.includeInactive === "true";

  const result = await query(
    `SELECT id, name, city, state, address, phone, is_active AS "isActive"
     FROM barbershops
     WHERE ($1::boolean = true OR is_active = true)
       AND ($2::text = '' OR lower(city) = lower($2))
       AND ($3::text = '' OR upper(state) = $3)
     ORDER BY city, name`,
    [includeInactive, city, state]
  );

  res.json({ data: result.rows });
}));

barbershopRoutes.post("/", requireRole("admin"), asyncHandler(async (req, res) => {
  const payload = barbershopSchema.parse(req.body);
  const result = await query(
    `INSERT INTO barbershops (name, city, state, address, phone, is_active)
     VALUES ($1, $2, upper($3), $4, $5, $6)
     RETURNING id, name, city, state, address, phone, is_active AS "isActive"`,
    [
      payload.name,
      payload.city,
      payload.state,
      payload.address ?? null,
      payload.phone ?? null,
      payload.isActive ?? true
    ]
  );

  const barbershop = result.rows[0];

  await query(
    `INSERT INTO settings (barbershop_id, business_name, phone, address, cancellation_limit_minutes, default_slot_interval_minutes, cancellation_policy_text)
     VALUES ($1, $2, $3, $4, 120, 30, 'Cancelamentos permitidos ate 2 horas antes do horario.')
     ON CONFLICT DO NOTHING`,
    [barbershop.id, barbershop.name, barbershop.phone, barbershop.address]
  );

  for (const weekday of [1, 2, 3, 4, 5, 6]) {
    await query(
      `INSERT INTO business_hours (barbershop_id, weekday, opens_at, closes_at, is_active)
       VALUES ($1, $2, '09:00', '19:00', true)
       ON CONFLICT (barbershop_id, weekday) DO NOTHING`,
      [barbershop.id, weekday]
    );
  }

  res.status(201).json({ data: barbershop, message: "Barbearia cadastrada" });
}));

barbershopRoutes.patch("/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const payload = barbershopSchema.partial().parse(req.body);
  const result = await query(
    `UPDATE barbershops
     SET name = COALESCE($1, name),
         city = COALESCE($2, city),
         state = COALESCE(upper($3), state),
         address = COALESCE($4, address),
         phone = COALESCE($5, phone),
         is_active = COALESCE($6, is_active),
         updated_at = now()
     WHERE id = $7
     RETURNING id, name, city, state, address, phone, is_active AS "isActive"`,
    [
      payload.name,
      payload.city,
      payload.state,
      payload.address,
      payload.phone,
      payload.isActive,
      req.params.id
    ]
  );

  res.json({ data: result.rows[0] ?? null, message: "Barbearia atualizada" });
}));
