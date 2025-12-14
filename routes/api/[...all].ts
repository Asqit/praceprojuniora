import { app } from "./mod.ts";

export const handler = (req: Request) => app.fetch(req);
