import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { Message } from "../utils/Message";

export class Validate {
  public static handle<T>(schema: ZodType<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = schema.parse(req.body);
        return next();
      } catch (error: any) {
        if (error instanceof ZodError) {
          const mapZodErrors = error.issues.map((iss, index) => [
            iss.path.length ? iss.path.join(".") : `field${index}`,
            iss.message,
          ]);

          const flatZodErrors = Object.fromEntries(mapZodErrors);
          return Message.fail({
            res,
            status: "badRequest",
            code: "INVALID_VALIDATION",
            errors: flatZodErrors,
          });
        }

        throw error;
      }
    };
  }
}
