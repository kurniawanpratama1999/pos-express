import { NextFunction, Request, Response } from "express";

class AuthMiddleware {
  public static handle(req: Request, res: Response, next: NextFunction) {
    const token = true;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    return next();
  }
}

export default AuthMiddleware;
