import { Router } from "express";
import { z } from "zod";
import { query } from "../../database/pool";
import { requireAuth, requireRole } from "../../middleware/auth";
import { asyncHandler } from "../../utils/async-handler";
import { HttpError } from "../../utils/http-error";

export const serviceRoutes = Router();

const serviceSchema = z.object({
  barbershopId: z.string().uuid().optional(),
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  price: z.number().nonnegative(),
  durationMinutes: z.number().int().positive(),
  isActive: z.boolean().optional()
});

serviceRoutes.use(requireAuth);

serviceRoutes.get("/", asyncHandler(async (req, res) => {
  const includeInactive = req.user!.role === "admin" && req.query.includeInactive === "true";
  const barbershopId = typeof req.query.barbershopId === "string" ? req.query.barbershopId : null;
  const result = await query(
    `SELECT id, name, description, price::float, duration_minutes AS "durationMinutes", is_active AS "isActive"
     FROM services
     WHERE ($1::boolean = true OR is_active = true)
       AND ($2::uuid IS NULL OR barbershop_id = $2)
     ORDER BY name`,
    [includeInactive, barbershopId]
  );
  res.json({ data: result.rows });
}));

serviceRoutes.post("/", requireRole("admin"), asyncHandler(async (req, res) => {
  const payload = serviceSchema.parse(req.body);
  const result = await query(
    `INSERT INTO services (barbershop_id, name, description, price, duration_minutes, is_active)
     VALUES (
       COALESCE($1::uuid, (SELECT barbershop_id FROM users WHERE id = $2), (SELECT id FROM barbershops ORDER BY created_at LIMIT 1)),
       $3, $4, $5, $6, $7
     )
     RETURNING id, name, description, price::float, duration_minutes AS "durationMinutes", is_active AS "isActive"`,
    [payload.barbershopId ?? null, req.user!.id, payload.name, payload.description ?? null, payload.price, payload.durationMinutes, payload.isActive ?? true]
  );
  res.status(201).json({ data: result.rows[0], message: "Servico criado" });
}));

serviceRoutes.get("/:id", asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, name, description, price::float, duration_minutes AS "durationMinutes", is_active AS "isActive"
     FROM services WHERE id = $1`,
    [req.params.id]
  );
  if (!result.rows[0]) throw new HttpError(404, "SERVICE_NOT_FOUND", "Servico nao encontrado");
  res.json({ data: result.rows[0] });
}));

serviceRoutes.patch("/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const payload = serviceSchema.partial().parse(req.body);
  const result = await query(
    `UPDATE services
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         price = COALESCE($3, price),
         duration_minutes = COALESCE($4, duration_minutes),
         is_active = COALESCE($5, is_active),
         updated_at = now()
     WHERE id = $6
     RETURNING id, name, description, price::float, duration_minutes AS "durationMinutes", is_active AS "isActive"`,
    [payload.name, payload.description, payload.price, payload.durationMinutes, payload.isActive, req.params.id]
  );
  if (!result.rows[0]) throw new HttpError(404, "SERVICE_NOT_FOUND", "Servico nao encontrado");
  res.json({ data: result.rows[0], message: "Servico atualizado" });
}));

serviceRoutes.delete("/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const result = await query(
    `UPDATE services SET is_active = false, updated_at = now()
     WHERE id = $1
     RETURNING id, name, description, price::float, duration_minutes AS "durationMinutes", is_active AS "isActive"`,
    [req.params.id]
  );
  if (!result.rows[0]) throw new HttpError(404, "SERVICE_NOT_FOUND", "Servico nao encontrado");
  res.json({ data: result.rows[0], message: "Servico desativado" });
}));
