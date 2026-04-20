import "dotenv/config";
import { match } from "ts-pattern";
import { z } from "zod";

const runtimeModes = {
  development: "DEVELOPMENT",
  production: "PRODUCTION",
} as const;

const baseSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum([...Object.values(runtimeModes)]),
});

const developmentSchema = baseSchema.extend({
  NODE_ENV: z.literal(runtimeModes.development),
});

const productionSchema = baseSchema.extend({
  NODE_ENV: z.literal(runtimeModes.production),
});

export async function validateEnvironment(exit: boolean = false) {
  try {
    const base = await baseSchema.parseAsync(process.env);
    return match(base.NODE_ENV)
      .with("DEVELOPMENT", async () => {
        return await developmentSchema.parseAsync(process.env);
      })
      .with("PRODUCTION", async () => {
        return await productionSchema.parseAsync(process.env);
      })
      .exhaustive();
  } catch (error) {
    console.error(error);
    if (exit) process.exit(1);
  }
}
