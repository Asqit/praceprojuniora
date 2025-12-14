import { type Context } from "hono";
import { HTTPException } from "hono/http-exception";
import * as zod from "zod";

export function errorHandler() {
  return (error: Error | HTTPException, c: Context) => {
    if (error instanceof zod.ZodError) {
      return c.json(
        {
          success: false,
          error: error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        },
        400
      );
    }

    if (error instanceof HTTPException) {
      return c.json(
        {
          success: false,
          error: error.message,
        },
        error.status
      );
    }

    return c.text("something went wrong", 500);
  };
}
