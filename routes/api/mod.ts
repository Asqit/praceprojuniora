import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { compress } from "hono/compress";
import { trafficLogger } from "./(_middlewares)/traffic-logger.ts";
import { errorHandler } from "./(_middlewares)/error-handler.ts";
import listingRoutes from "./(_routes)/listing.route.ts";
import guestbookRoutes from "./(_routes)/guestbook.route.ts";
import cvRoutes from "./(_routes)/cv.route.ts";

export const app = new Hono().basePath("/api");

app.use(cors());
app.use(secureHeaders());
app.use(compress());
app.use(trafficLogger());
app.route("/listings", listingRoutes);
app.route("/guestbook", guestbookRoutes);
app.route("/cv", cvRoutes);
app.onError(errorHandler());

export type AppType = typeof app;
