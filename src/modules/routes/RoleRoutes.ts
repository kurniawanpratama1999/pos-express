import { Router } from "express";
import { RoleController } from "../controllers/Accessibility/RoleController";
import { RoleValidation } from "../validations/role.validation";
import { Validate } from "../middlewares/ValidateMiddleware";

const RoleRoute = Router();

RoleRoute.get("/", RoleController.index);
RoleRoute.get("/:id", RoleController.show);

RoleRoute.post("/", RoleController.store);
RoleRoute.put(
  "/:id",
  Validate.handle(RoleValidation.storeUpdate()),
  RoleController.update
);

RoleRoute.delete("/:id", RoleController.destroy);

export { RoleRoute };
