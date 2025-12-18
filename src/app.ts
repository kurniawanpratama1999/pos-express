import express, { Request, Response } from "express";
import { UserRoute } from "./modules/routes/UserRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthMiddleware from "./modules/middlewares/AuthMiddleware";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { AuthRoute } from "./modules/routes/AuthRoutes";
import { RoleRoute } from "./modules/routes/RoleRoutes";
import path from "path";
import { RoleMiddleware } from "./modules/middlewares/RoleMiddleware";

// VERSIONING -> usage -> versioning("v1", "user");
const versioning = (version: string, name: string): string =>
  `/api/${version}/${name}`;

// MIDDLEWARES -> usage -> ...protectedMiddlewares
const protectedMiddlewares = (isActive: boolean = true) => {
  if (!isActive) {
    return [];
  }

  return [AuthMiddleware.handle, RoleMiddleware.handle];
};

// CORS -> usage -> app.use(corsConfig)
const corsConfig = cors({
  credentials: true,
  methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
  allowedHeaders: ["Content-Type", "Authorization", "x-current-url"],
  origin: ["http://localhost:5173", "https://demo-pos-express.vercel.app"],
});

// ACTIVATED MIDDLEWARE
const middlewares = protectedMiddlewares(true);

// INITIATE EXPRESS
const app = express();

// COOKIE PARSER
app.use(cookieParser());

// CORS
app.use(corsConfig);

// HELMET
app.use(helmet());

// ALWAYS PARSE from JSON.stringify to JSON.parse
app.use(express.json());

// USER REQUEST LIMIT
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// DOCUMENTATION
app.get(versioning("v1", "documentation"), (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, "public", "documentation.html"))
);

// AUTH
app.use(versioning("v1", "auth"), AuthRoute);

// USER
app.use(versioning("v1", "user"), ...middlewares, UserRoute);

// ROLE
app.use(versioning("v1", "role"), ...middlewares, RoleRoute);

export default app;
