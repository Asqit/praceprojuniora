import { z } from "zod";

export const getAllQuery = z.object({
  cursor: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  sortBy: z.enum(["popularity", "expiration", "newest"]).optional(),
});

export const bulkJson = z.object({
  ids: z.array(z.number()),
});
