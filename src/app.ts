import express from "express";
import { UserRoute } from "./modules/routes/UserRoutes";
import cors from "cors";
import AuthMiddleware from "./modules/middlewares/Auth";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

app.use(
  cors({
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: ["http://localhost:5173", "https://demo-pos-express.vercel.app"],
  })
);
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use("/user", AuthMiddleware.handle, UserRoute);

export default app;
