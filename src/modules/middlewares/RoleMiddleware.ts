import { NextFunction, Request, Response } from "express";
import { Message } from "../utils/Message";
import { prisma } from "../../lib/prisma";
import { roleCache } from "../cache/roleCache";

export class RoleMiddleware {
  public static async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUrl = String(req.headers["x-current-url"]);

      const user = req.user;
      if (!currentUrl) {
        return Message.badRequest(res, {
          message: "x-current-url is empty on header",
        });
      }

      if (!user) {
        return Message.unauthorized(res, { message: "Please login first" });
      }

      const roleId: number = user.roleId;

      if (roleId === 1) {
        return next();
      }

      const cacheKey = `roleAnchors:${roleId}`;
      let cached = roleCache.get(cacheKey);

      let roleAnchors: any[];
      if (cached && cached.expired > Date.now()) {
        roleAnchors = cached.data;
      } else {
        roleAnchors = await prisma.roleAnchor.findMany({
          where: { roleId },
          include: {
            anchor: true,
          },
        });

        roleCache.set(cacheKey, {
          data: roleAnchors,
          expired: Date.now() + 24 * 60 * 60 * 1000,
        });
      }

      const urls = roleAnchors.map((roleAnchor) => roleAnchor.anchor.url);

      const isAllowed = urls.some((url) => {
        const normalizePath = currentUrl.replace(/\/+$/, "");
        const normalizeUrl = url.replace(/\/+$/, "");

        return normalizePath.startsWith(normalizeUrl);
      });

      if (!isAllowed) {
        return Message.forbidden(res, {
          message: `cannot access ${currentUrl}`,
        });
      }

      return next();
    } catch (error) {
      return Message.error(res, { message: "something wrong in role access" });
    }
  }
}
