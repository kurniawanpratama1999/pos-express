import { Router } from "express";
import { UserController } from "../controllers/Accessibility/UserController";
import { UserValidation } from "../validations/user.validation";
import { Validate } from "../middlewares/ValidateMiddleware";

const UserRoute = Router();

// GET api/v1/user -> Ambil semua data user -> password tidak terdisplay
UserRoute.get("/", UserController.index);

// POST api/v1/user -> input user baru -> body:{name, email, password, password_confirmation}
UserRoute.post(
  "/",
  Validate.handle(UserValidation.store()),
  UserController.store
);

// GET api/v1/user/{id} -> Ambil salah satu user berdasarkan id-nya
UserRoute.get("/:id", UserController.show);

// PUT api/v1/user/{id} -> update data user -> body:{name, email, password?} -> password kosong artinya password tidak terupdate
UserRoute.put(
  "/:id",
  Validate.handle(UserValidation.update()),
  UserController.update
);

// PATCH api/v1/user/{id}/delete -> SoftDelete
UserRoute.patch("/:id/delete", UserController.softDelete);

// PATCH api/v1/user/{id}/restore -> rollback softDelete
UserRoute.patch("/:id/restore", UserController.restore);

// DELETE api/v1/user/{id} -> hapus user permanen
UserRoute.delete("/:id", UserController.destroy);
export { UserRoute };
