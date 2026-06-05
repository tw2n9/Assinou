import { Router } from "express";
import { z } from "zod";
import { query } from "../../database/pool";
import { requireAuth, requireRole } from "../../middleware/auth";
import { asyncHandler } from "../../utils/async-handler";
import { createScheduleBlock, getAvailability } from "./schedules.service";

export const scheduleRoutes = Router();

scheduleRoutes.use(requireAuth);

const hourSchema = z.object({
  weekday: z.number().int().min(0).max(6),
  opensAt: z.string(),
  closesAt: z.string(),
  isActive: z.boolean().optional()
});

const barberHourSchema = z.object({
  weekday: z.number().int().min(0).max(6),
  startsAt: z.string(),
  endsAt: z.string(),
  isActive: z.boolean().optional()
});

const blockSchema = z.object({
  barberId: z.string().uuid().nullable().optional(),
  date: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  reason: z.string().optional().nullable()
});

async function getCurrentBarberId(userId: string) {
  const result = await query<{ id: string }>(
    "SELECT id FROM barbers WHERE user_id = $1 AND is_active = true",
    [userId]
  );

  return result.rows[0]?.id ?? null;
}

scheduleRoutes.get("/business-hours", requireRole("admin"), asyncHandler(async (_req, res) => {
  const result = await query(
    `SELECT weekday, opens_at AS "opensAt", closes_at AS "closesAt", is_active AS "isActive"
     FROM business_hours ORDER BY weekday`
  );
  res.json({ data: result.rows });
}));

scheduleRoutes.put("/business-hours", requireRole("admin"), asyncHandler(async (req, res) => {
  const payload = z.object({ hours: z.array(hourSchema) }).parse(req.body);

  for (const hour of payload.hours) {
    await query(
      `INSERT INTO business_hours (weekday, opens_at, closes_at, is_active)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (weekday)
       DO UPDATE SET opens_at = EXCLUDED.opens_at,
                     closes_at = EXCLUDED.closes_at,
                     is_active = EXCLUDED.is_active,
                     updated_at = now()`,
      [hour.weekday, hour.opensAt, hour.closesAt, hour.isActive ?? true]
    );
  }

  res.json({ data: payload.hours, message: "Horarios atualizados" });
}));

scheduleRoutes.get("/me/working-hours", requireRole("barber"), asyncHandler(async (req, res) => {
  const barberId = await getCurrentBarberId(req.user!.id);
  if (!barberId) {
    return res.json({ data: [] });
  }

  const result = await query(
    `SELECT weekday, starts_at AS "startsAt", ends_at AS "endsAt", is_active AS "isActive"
     FROM barber_working_hours
     WHERE barber_id = $1
     ORDER BY weekday, starts_at`,
    [barberId]
  );

  res.json({ data: result.rows });
}));

scheduleRoutes.put("/me/working-hours", requireRole("barber"), asyncHandler(async (req, res) => {
  const payload = z.object({ hours: z.array(barberHourSchema) }).parse(req.body);
  const barberId = await getCurrentBarberId(req.user!.id);

  if (!barberId) {
    return res.status(404).json({
      error: {
        code: "BARBER_PROFILE_NOT_FOUND",
        message: "Perfil de barbeiro nao encontrado"
      }
    });
  }

  await query("DELETE FROM barber_working_hours WHERE barber_id = $1", [barberId]);

  for (const hour of payload.hours) {
    await query(
      `INSERT INTO barber_working_hours (barber_id, weekday, starts_at, ends_at, is_active)
       VALUES ($1, $2, $3, $4, $5)`,
      [barberId, hour.weekday, hour.startsAt, hour.endsAt, hour.isActive ?? true]
    );
  }

  res.json({ data: payload.hours, message: "Meus horarios foram atualizados" });
}));

scheduleRoutes.get("/barbers/:barberId/working-hours", asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT weekday, starts_at AS "startsAt", ends_at AS "endsAt", is_active AS "isActive"
     FROM barber_working_hours
     WHERE barber_id = $1
     ORDER BY weekday`,
    [req.params.barberId]
  );
  res.json({ data: result.rows });
}));

scheduleRoutes.put("/barbers/:barberId/working-hours", requireRole("admin"), asyncHandler(async (req, res) => {
  const payload = z.object({ hours: z.array(barberHourSchema) }).parse(req.body);

  await query("DELETE FROM barber_working_hours WHERE barber_id = $1", [req.params.barberId]);

  for (const hour of payload.hours) {
    await query(
      `INSERT INTO barber_working_hours (barber_id, weekday, starts_at, ends_at, is_active)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.params.barberId, hour.weekday, hour.startsAt, hour.endsAt, hour.isActive ?? true]
    );
  }

  res.json({ data: payload.hours, message: "Horario do barbeiro atualizado" });
}));

scheduleRoutes.get("/availability", asyncHandler(async (req, res) => {
  const payload = z.object({
    barberId: z.string().uuid(),
    serviceId: z.string().uuid(),
    date: z.string()
  }).parse(req.query);

  const data = await getAvailability(payload);
  res.json({ data });
}));

scheduleRoutes.post("/blocks", requireRole("admin"), asyncHandler(async (req, res) => {
  const payload = blockSchema.parse(req.body);
  const data = await createScheduleBlock(payload);
  res.status(201).json({ data, message: "Bloqueio criado" });
}));

scheduleRoutes.delete("/blocks/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  await query("DELETE FROM schedule_blocks WHERE id = $1", [req.params.id]);
  res.json({ data: null, message: "Bloqueio removido" });
}));
