import { NextFunction, Request, Response } from "express";
import { Message } from "../utils/Message";
import { JsonWebToken } from "../utils/Jwt";

class AuthMiddleware {
  public static handle(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers.authorization;

      if (!authorization) {
        return Message.fail({
          res,
          code: "TOKEN_IS_MISSING",
          status: "notFound",
        });
      }

      const token = authorization.split(" ")[1];

      if (!token) {
        return Message.fail({
          res,
          code: "TOKEN_IS_MISSING",
          status: "notFound",
        });
      }

      const payload = JsonWebToken.verifyAccessToken(token);

      if (!payload) {
        return Message.fail({
          res,
          code: "TOKEN_IS_MISSING",
          status: "forbidden",
        });
      }

      req.user = payload;
      return next();
    } catch (error: any) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        return Message.fail({
          res,
          code: "TOKEN_IS_MISSING",
          status: "forbidden",
        });
      }

      return Message.fail({
        res,
        code: "TOKEN_IS_MISSING",
        status: "error",
      });
    }
  }
}

export default AuthMiddleware;
