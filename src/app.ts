import express, { Request, Response } from "express";
import { UserRoute } from "./modules/routes/UserRoutes";
import cors from "cors";
import AuthMiddleware from "./modules/middlewares/AuthMiddleware";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { AuthRoute } from "./modules/routes/AuthRoutes";
import { RoleRoute } from "./modules/routes/RoleRoutes";
import path from "path";

const app = express();

app.use(
  cors({
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "x-current-url"],
    origin: ["http://localhost:5173", "https://demo-pos-express.vercel.app"],
  })
);
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.get("/api/v1/documentation", (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "public", "documentation.html");
  console.log(filePath);
  return res.sendFile(filePath);
});
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/user", AuthMiddleware.handle, UserRoute);
app.use("/api/v1/role", AuthMiddleware.handle, RoleRoute);

export default app;
