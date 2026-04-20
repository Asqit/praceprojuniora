import { z } from "zod";

export const getAllQuery = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  sortBy: z.enum(["popularity", "expiration", "newest"]).optional(),
  location: z.string().optional(),
  search: z.string().optional(),
});

export const bulkJson = z.object({
  ids: z.array(z.number()),
});

export const clickCounterParam = z.object({
  id: z.coerce.number(),
});
