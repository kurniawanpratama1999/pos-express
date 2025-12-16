import z, { ZodObject } from "zod";

export class UserValidation {
  public static store(): ZodObject {
    return z.object({
      name: z.string().min(3),
      email: z.email(),
      roleId: z.number().min(1),
      password: z.string().min(8),
      password_confirmation: z.string().min(8),
    });
  }

  public static update(): ZodObject {
    return z.object({
      name: z.string().min(3),
      roleId: z.number().min(1),
      email: z.email(),
      password: z.string().min(8).optional(),
    });
  }
}
