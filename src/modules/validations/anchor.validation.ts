import z, { ZodObject } from "zod";

export class AnchorValidation {
  public static storeUpdate(): ZodObject {
    return z.object({
      icon: z.string(),
      name: z.string(),
      url: z.string(),
    });
  }
}
