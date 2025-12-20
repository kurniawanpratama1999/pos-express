import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";
import { Hash } from "../../utils/Hash";
import { JsonWebToken } from "../../utils/Jwt";
import "dotenv/config";
import { JsonWebTokenError } from "jsonwebtoken";

export class AuthController {
  public static async login(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await prisma.user.findFirst({
        where: { email, AND: { deleted_at: null } },
        omit: { updated_at: true, deleted_at: true },
      });

      if (!user) {
        return Message.fail({
          res,
          status: "notFound",
          code: "INVALID_CREDENTIALS",
        });
      }

      const comparePassword = await Hash.compare(password, user.password);

      if (!comparePassword) {
        return Message.fail({
          res,
          status: "notFound",
          code: "INVALID_CREDENTIALS",
        });
      }

      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      const refreshToken = JsonWebToken.signRefreshToken(payload);
      const accessToken = JsonWebToken.signAccessToken(payload);

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const expired_at = new Date();

      expired_at.setDate(expired_at.getDate() + 7);

      await prisma.refreshToken.upsert({
        where: { userId: user.id },
        update: {
          token: refreshToken,
          expired_at,
        },
        create: {
          userId: user.id,
          token: refreshToken,
          expired_at,
        },
      });

      return Message.ok({ res, code: "LOGIN_SUCCESS", data: accessToken });
    } catch (error) {
      console.log(error);
      return Message.fail({ res, status: "error", code: "LOGIN_FAILED" });
    }
  }

  public static async refresh(req: Request, res: Response) {
    try {
      const refresh_token = req.cookies["refresh_token"];
      if (!refresh_token) {
        return Message.fail({
          res,
          status: "unauthorized",
          code: "UNAUTHENTICATED",
        });
      }

      const findToken = await prisma.refreshToken.findUnique({
        where: { token: refresh_token },
      });

      if (
        !findToken ||
        !findToken.expired_at ||
        findToken.expired_at.getTime() <= Date.now()
      ) {
        return Message.fail({
          res,
          status: "unauthorized",
          code: "UNAUTHENTICATED",
        });
      }

      const refreshTokenPayload: any =
        JsonWebToken.verifyRefreshToken(refresh_token);

      const accessTokenPayload = {
        id: refreshTokenPayload.id,
        name: refreshTokenPayload.name,
        email: refreshTokenPayload.email,
      };

      const newAccessToken = JsonWebToken.signAccessToken(accessTokenPayload);

      return Message.created({
        res,
        code: "TOKEN_CREATE_SUCCESS",
        data: newAccessToken,
      });
    } catch (error: any) {
      console.log(error);
      if (error instanceof JsonWebTokenError) {
        switch (error.name) {
          case "TokenExpiredError":
            return Message.fail({
              res,
              status: "unauthorized",
              code: "UNAUTHENTICATED",
            });
        }
      }

      return Message.fail({
        res,
        status: "unauthorized",
        code: "UNAUTHENTICATED",
      });
    }
  }

  public static async logout(req: Request, res: Response) {
    try {
      const refresh_token = req.cookies.refresh_token;

      if (!refresh_token) {
        return Message.ok({ res, code: "LOGOUT_SUCCESS", data: null });
      }

      await prisma.refreshToken
        .delete({ where: { token: refresh_token } })
        .catch(() => {});

      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return Message.ok({ res, code: "LOGOUT_SUCCESS", data: null });
    } catch (error) {
      console.log(error);
      return Message.fail({ res, status: "error", code: "LOGOUT_FAILED" });
    }
  }
}
