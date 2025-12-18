import { NextFunction, Request, Response } from "express";
import { Message } from "../utils/Message";
import { JsonWebToken } from "../utils/Jwt";

class AuthMiddleware {
  public static handle(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers.authorization;

      if (!authorization) {
        return Message.unauthorized(res, { message: "TOKEN_NOT_FOUND" });
      }

      const token = authorization.split(" ")[1];

      if (!token) {
        return Message.unauthorized(res, { message: "TOKEN_IS_MISSING" });
      }

      const payload = JsonWebToken.verifyAccessToken(token);

      if (!payload) {
        return Message.unauthorized(res, { message: "TOKEN_EXPIRED" });
      }

      req.user = payload;
      return next();
    } catch (error: any) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        return Message.unauthorized(res, { message: "TOKEN_EXPIRED" });
      }

      return Message.unauthorized(res, { message: "TOKEN_INVALID_FORMAT" });
    }
  }
}

export default AuthMiddleware;
