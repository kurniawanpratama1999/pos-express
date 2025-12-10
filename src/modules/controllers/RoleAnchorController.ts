import { Request, Response } from "express";
import { Message } from "../utils/Message";
import { prisma } from "../../lib/prisma";

export class RoleAnchorController {
  public static async index(req: Request, res: Response) {
    try {
      const rolesAnchors = await prisma.roleAnchor.findMany({
        include: {
          role: true,
          anchor: true,
        },
      });
      return Message.ok(res, "Fetch all anchor is success", rolesAnchors);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
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
        `Fetch all anchor based on role id-${roleId} is success`,
        roleAnchors
      );
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async upsert(req: Request, res: Response) {
    try {
      const data = req.body;
      const roleId = data[0].roleId;

      const trxs = await prisma.$transaction(async (trx) => {
        await trx.roleAnchor.deleteMany({ where: { roleId } }).catch(() => {});
        const create = await trx.roleAnchor.createMany({ data });
        return create;
      });

      return Message.ok(res, "new anchors is Success", trxs);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
}
