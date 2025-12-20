import { Router } from "express";
import { AnchorController } from "../controllers/Accessibility/AnchorController";
import { Validate } from "../middlewares/ValidateMiddleware";
import { AnchorValidation } from "../validations/anchor.validation";

const AnchorRoute = Router();

AnchorRoute.get("/", AnchorController.index);
AnchorRoute.get("/:id", AnchorController.show);

AnchorRoute.post(
  "/",
  Validate.handle(AnchorValidation.storeUpdate()),
  AnchorController.store
);

AnchorRoute.put(
  "/:id",
  Validate.handle(AnchorValidation.storeUpdate()),
  AnchorController.update
);

AnchorRoute.delete("/:id", AnchorController.destroy);

export { AnchorRoute };
