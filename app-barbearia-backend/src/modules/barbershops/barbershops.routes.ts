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

  res.status(201).json({ data: result.rows[0], message: "Barbearia cadastrada" });
}));
