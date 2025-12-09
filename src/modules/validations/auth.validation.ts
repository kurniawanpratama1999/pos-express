import z, { ZodObject } from "zod";

export class AuthValidation {
  public static login(): ZodObject {
    return z.object({
      email: z.email(),
      password: z.string().min(8),
    });
  }
}
