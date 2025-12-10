import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { Message } from "./Message";

export class Validate {
  public static handle(schema: ZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = schema.parse(req.body);
        return next();
      } catch (error: any) {
        return Message.conflict(res, JSON.parse(error.message));
      }
    };
  }
}
