import { Context } from "hono";

// TODO: Add zod support + actual error handling
export function errorHandler() {
  return async function (_error: Error, c: Context) {
    return c.text("Internal Server Error");
  };
}
