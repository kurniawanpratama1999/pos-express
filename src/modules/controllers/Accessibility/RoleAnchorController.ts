import { Request, Response } from "express";
import { Message } from "../../utils/Message";
import { prisma } from "../../../lib/prisma";
import { roleCache } from "../../cache/roleCache";

export class RoleAnchorController {
  public static async index(req: Request, res: Response) {
    try {
      const rolesAnchors = await prisma.roleAnchor.findMany({
        include: {
          role: true,
          anchor: true,
        },
      });
      return Message.ok(res, "FETCH_ROLES_ANCHORS_IS_SUCCESS", rolesAnchors);
    } catch (error: any) {
      console.error(error);
      return Message.error(res, { message: "ERROR_FETCH_ROLES_ANCHORS" });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const roleId = Number(req.params.id);
      const roleAnchors = await prisma.roleAnchor.findMany({
        where: { roleId },
        include: { anchor: true, role: true },
      });
      return Message.ok(
        res,
        `FETCH_ROLES_${roleId}_ANCHORS_IS_SUCCESS`,
        roleAnchors
      );
    } catch (error: any) {
      console.error(error);
      return Message.error(res, {
        message: `ERROR_FETCH_ROLES_ANCHORS`,
      });
    }
  }
  public static async upsert(req: Request, res: Response) {
    try {
      const data = req.body;
      const roleId = data[0].roleId;

      const trxs = await prisma.$transaction(async (trx) => {
        await trx.roleAnchor.deleteMany({ where: { roleId } }).catch(() => {});
        const create = await trx.roleAnchor.createMany({
          data: {
            anchorId: data.anchorId,
            roleId: data.roleId,
          },
        });

        return create;
      });

      const cacheKey = `roleAnchors:${roleId}`;
      roleCache.set(cacheKey, {
        data: trxs,
        expired: Date.now() + 24 * 60 * 60 * 1000,
      });

      return Message.ok(res, "UPDATE_ROLES_ANCHOR_IS_SUCCESS", trxs);
    } catch (error: any) {
      return Message.error(res, { message: "ERROR_UPDATE_ROLES_ANCHOR" });
    }
  }
}
