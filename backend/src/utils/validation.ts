import { z } from "zod";

export const aiEventSchema = z.object({
  timestamp: z.string().datetime(),
  worker_id: z.string().min(1),
  workstation_id: z.string().min(1),
  event_type: z.string().min(1),
  confidence: z.number().min(0).max(1),
  count: z.number().int().min(0).optional(),
  model_version: z.string().optional(),
});

export const batchEventSchema = z.object({
  events: z.array(aiEventSchema).min(1).max(1000),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "viewer"]).optional(),
});

export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};
