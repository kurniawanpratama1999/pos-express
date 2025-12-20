import { Request, Response } from "express";
import { Message } from "../../utils/Message";
import { prisma } from "../../../lib/prisma";
import { roleCache } from "../../cache/roleCache";
import { Prisma } from "../../../generated/prisma/client";

export class RoleAnchorController {
  public static async index(req: Request, res: Response) {
    try {
      const rolesAnchors = await prisma.roleAnchor.findMany({
        include: {
          role: true,
          anchor: true,
        },
      });
      return Message.ok({
        res,
        code: "PERMISSION_FETCH_SUCCESS",
        data: rolesAnchors,
      });
    } catch (error: any) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "PERMISSION_FETCH_FAILED",
      });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const roleId = Number(req.params.id);

      if (!roleId) {
        return Message.fail({
          res,
          status: "notFound",
          code: "PERMISSION_ID_NOT_FOUND",
        });
      }

      const roleAnchors = await prisma.roleAnchor.findMany({
        where: { roleId },
        include: { anchor: true, role: true },
      });

      if (!roleAnchors) {
        return Message.fail({
          res,
          status: "notFound",
          code: "PERMISSION_NOT_FOUND",
        });
      }

      return Message.ok({
        res,
        code: "PERMISSION_FETCH_SUCCESS",
        data: roleAnchors,
      });
    } catch (error: any) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "PERMISSION_FETCH_FAILED",
      });
    }
  }
  public static async upsert(req: Request, res: Response) {
    try {
      const body = req.body;
      const roleId = body[0].roleId;

      const trxs = await prisma.$transaction(async (trx) => {
        await trx.roleAnchor.deleteMany({ where: { roleId } }).catch(() => {});
        const create = await trx.roleAnchor.createMany({
          data: {
            anchorId: body.anchorId,
            roleId: body.roleId,
          },
          skipDuplicates: true,
        });

        return create;
      });

      const cacheKey = `roleAnchors:${roleId}`;

      roleCache.set(cacheKey, {
        data: trxs,
        expired: Date.now() + 24 * 60 * 60 * 1000,
      });

      return Message.ok({
        res,
        code: "PERMISSION_UPDATE_SUCCESS",
        data: null,
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log("PRISMA : ", error);
      } else {
        console.log("UNIVERSAL : ", error);
      }

      return Message.fail({
        res,
        status: "error",
        code: "PERMISSION_UPDATE_FAILED",
      });
    }
  }
}
