import z, { ZodObject } from "zod";

export class RoleValidation {
  public static storeUpdate(): ZodObject {
    return z.object({
      name: z.string(),
    });
  }
}
