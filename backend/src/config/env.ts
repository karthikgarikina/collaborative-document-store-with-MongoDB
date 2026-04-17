import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  PORT: z.coerce.number().default(4000),
  SEED_DOCUMENT_COUNT: z.coerce.number().default(1000),
  CORS_ORIGIN: z.string().default("http://localhost:4173")
});

export const env = envSchema.parse(process.env);
