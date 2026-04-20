import { Context } from "hono";

// TODO: Add zod support + actual error handling
export function errorHandler() {
  return async function (error: Error, c: Context) {
    console.error(error)
    return c.text("Internal Server Error");
  };
}
