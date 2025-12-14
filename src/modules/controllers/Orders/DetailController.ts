import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class DetailController {
  public static async index(req: Request, res: Response) {
    try {
      const details = await prisma.orderDetail.findMany();
      return Message.ok(res, "Fetch details is success", details);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const detail = await prisma.orderDetail.findUnique({ where: { id } });
      return Message.ok(res, `Fetch detail by id-${id} is success`, detail);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
}
