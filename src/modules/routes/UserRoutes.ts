import { Router } from "express";
import { UserController } from "../controllers/UserController";

const UserRoute = Router();
UserRoute.get("/", UserController.index);
UserRoute.post("/", UserController.store);

export { UserRoute };
