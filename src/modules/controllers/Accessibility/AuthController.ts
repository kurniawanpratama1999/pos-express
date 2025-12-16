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

      const user = await prisma.user.findUnique({
        where: { email, AND: { deleted_at: null } },
        omit: { updated_at: true, deleted_at: true },
      });

      if (!user) {
        return Message.notfound(res, { message: "Email atau password salah" });
      }

      const comparePassword = await Hash.compare(password, user.password);

      if (!comparePassword) {
        return Message.notfound(res, { message: "Email atau password salah" });
      }

      const { password: userPassword, ...payload } = user;

      const refreshToken = JsonWebToken.signRefreshToken(payload);
      const accessToken = JsonWebToken.signAccessToken(payload);

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const expired_at = new Date();
      expired_at.setDate(expired_at.getDate() + 7);

      await prisma.accessToken.upsert({
        create: {
          userId: user.id,
          token: refreshToken,
          expired_at,
        },
        update: {
          userId: user.id,
          token: refreshToken,
          expired_at,
        },
        where: { userId: user.id, token: refreshToken },
      });

      return Message.ok(res, "Login berhasil", { user, accessToken });
    } catch (error) {
      return Message.error(res, { message: "something wrong" });
    }
  }

  public static async refresh(req: Request, res: Response) {
    try {
      const refresh_token = req.cookies.refresh_token;

      if (!refresh_token) {
        return Message.unauthorized(res, { message: "Please login again!" });
      }

      const findToken = await prisma.accessToken.findUnique({
        where: { token: refresh_token },
      });

      if (!findToken || !findToken.expired_at) {
        return Message.unauthorized(res, { message: "Invalid Token" });
      }

      const isExpired = Date.now() > findToken.expired_at.getTime();

      if (isExpired) {
        return Message.unauthorized(res, { message: "Please login again" });
      }

      const payload = JsonWebToken.verifyRefreshToken(refresh_token);
      const newAccessToken = JsonWebToken.signAccessToken(payload);

      return Message.ok(res, "access token is genereted", {
        accessToken: newAccessToken,
      });
    } catch (error) {
      return Message.error(res, { message: "something wrong" });
    }
  }

  public static async logout(req: Request, res: Response) {
    try {
      const refresh_token = req.cookies.refresh_token;

      if (!refresh_token) {
        return Message.ok(res, "Already logout", {});
      }

      await prisma.accessToken
        .delete({ where: { token: refresh_token } })
        .catch(() => {});

      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return Message.ok(res, "Logout success", {});
    } catch (error) {
      return Message.error(res, { message: "something wrong" });
    }
  }
}
