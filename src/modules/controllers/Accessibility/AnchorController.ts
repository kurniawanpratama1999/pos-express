import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class AnchorController {
  public static async index(req: Request, res: Response) {
    try {
      const anchors = await prisma.anchor.findMany();
      return Message.ok(res, "Fetch all anchor is success", anchors);
    } catch (error) {
      return Message.error(res, {
        message: "Something wrong when fetch anchors",
      });
    }
  }

  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const anchor = await prisma.anchor.findUnique({ where: { id } });
      return Message.ok(res, `Fetch anchor with id-${id} is success`, anchor);
    } catch (error) {
      return Message.error(res, { message: "Failed for fetch Anchor" });
    }
  }

  public static async store(req: Request, res: Response) {
    try {
      const data = req.body;
      const anchor = await prisma.anchor.create({
        data: {
          name: data.name,
          icon: data.icon,
          url: data.url,
        },
      });

      return Message.ok(res, "new anchor is added", anchor);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const anchor = await prisma.anchor.update({
        data: {
          name: data.name,
          icon: data.icon,
          url: data.url,
        },
        where: { id },
      });
      return Message.ok(res, `update anchor with id-${id} is success`, anchor);
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }

  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (id <= 3) {
        return Message.badRequest(res, {
          message: "cannot delete for id 1",
        });
      }

      const anchor = await prisma.anchor.delete({ where: { id } });
      return Message.ok(res, `update anchor with id-${id} is success`, anchor);
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
}
