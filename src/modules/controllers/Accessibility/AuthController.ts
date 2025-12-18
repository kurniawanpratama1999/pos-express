import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";
import { Hash } from "../../utils/Hash";
import { JsonWebToken } from "../../utils/Jwt";
import "dotenv/config";

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
        return Message.unauthorized(res, {
          message: "INCORRECT_EMAIL_OR_PASSWORD",
        });
      }

      const comparePassword = await Hash.compare(password, user.password);

      if (!comparePassword) {
        return Message.unauthorized(res, {
          message: "INCORRECT_EMAIL_OR_PASSWORD",
        });
      }

      const {
        name,
        email: userEmail,
        password: userPassword,
        created_at,
        ...payload
      } = user;

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

      return Message.ok(res, "LOGIN_SUCCESS", accessToken);
    } catch (error) {
      return Message.error(res, { message: error });
    }
  }

  public static async refresh(req: Request, res: Response) {
    try {
      const refresh_token = req.cookies["refresh_token"];
      if (!refresh_token) {
        return Message.unauthorized(res, { message: "CREDENTIAL_IS_MISSING" });
      }

      const findToken = await prisma.refreshToken.findUnique({
        where: { token: refresh_token },
      });

      if (!findToken || !findToken.expired_at) {
        return Message.unauthorized(res, { message: "CREDENTIAL_NOT_FOUND" });
      }

      const isExpired = Date.now() > findToken.expired_at.getTime();

      if (isExpired) {
        return Message.unauthorized(res, { message: "CREDENTIAL_EXPIRED" });
      }

      const payload = JsonWebToken.verifyRefreshToken(refresh_token);
      const { iat, exp, ...userPayload } = payload as any;
      const newAccessToken = JsonWebToken.signAccessToken(userPayload);

      return Message.ok(res, "CREDENTIAL_CREATED", newAccessToken);
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return Message.unauthorized(res, { message: "CREDENTIAL_EXPIRED" });
      }

      return Message.error(res, { message: "CREDENTIAL_INVALID_FORMAT" });
    }
  }

  public static async logout(req: Request, res: Response) {
    try {
      const refresh_token = req.cookies.refresh_token;

      if (!refresh_token) {
        return Message.ok(res, "ALREADY_LOGOUT", {});
      }

      await prisma.refreshToken
        .delete({ where: { token: refresh_token } })
        .catch(() => {});

      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return Message.ok(res, "LOGOUT_SUCCESS", {});
    } catch (error) {
      return Message.error(res, { message: "SOMETHING_WRONG" });
    }
  }
}
