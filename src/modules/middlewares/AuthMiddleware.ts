import { NextFunction, Request, Response } from "express";
import { Message } from "../utils/Message";
import { JsonWebToken } from "../utils/Jwt";

class AuthMiddleware {
  public static handle(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers.authorization;

      if (!authorization) {
        return Message.unauthorized(res, { message: "Token is missing" });
      }

      const token = authorization.split(" ")[1];

      if (!token) {
        return Message.unauthorized(res, { message: "Token is missing" });
      }

      const payload = JsonWebToken.verifyAccessToken(token);

      if (!payload) {
        return Message.unauthorized(res, { message: "Token expired" });
      }

      req.user = payload;
      return next();
    } catch (error) {
      return Message.unauthorized(res, { message: "Token invalid format" });
    }
  }
}

export default AuthMiddleware;
