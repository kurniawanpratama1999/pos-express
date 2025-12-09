import { Router } from "express";
import { Validate } from "../utils/Validate";
import { AuthValidation } from "../validations/auth.validation";
import { AuthController } from "../controllers/AuthController";

const AuthRoute = Router();

// POST api/v1/auth/login -> body:{email, password}
AuthRoute.post(
  "/login",
  Validate.handle(AuthValidation.login()),
  AuthController.login
);

// DELETE api/v1/auth/logout -> keluar
AuthRoute.delete("/logout", AuthController.logout);

// GET api/v1/auth/refresh -> ambil token baru untuk authorization
AuthRoute.get("/refresh", AuthController.refresh);

export { AuthRoute };
