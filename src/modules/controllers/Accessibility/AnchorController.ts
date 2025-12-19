import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class AnchorController {
  public static async index(req: Request, res: Response) {
    try {
      const anchors = await prisma.anchor.findMany();
      return Message.ok(res, "FETCH_ANCHORS_IS_SUCCESS", anchors);
    } catch (error) {
      console.error(error);
      return Message.error(res, {
        message: "ERROR_FETCH_ANCHORS",
      });
    }
  }

  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const anchor = await prisma.anchor.findUnique({ where: { id } });
      return Message.ok(res, `FETCH_ANCHOR_${id}_IS_SUCCESS`, anchor);
    } catch (error) {
      console.error(error);
      return Message.error(res, { message: "ERROR_FETCH_ANCHOR" });
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

      return Message.created(res, "NEW_ANCHOR_IS_ADDED", anchor);
    } catch (error: any) {
      console.error(error);
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
      return Message.ok(res, `UPDATE_ANCHOR_${id}_IS_SUCCESS`, anchor);
    } catch (error: any) {
      console.error(error);
      return Message.unprocessable(res, { message: "ERROR_UPDATE_ANCHOR" });
    }
  }

  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (id <= 3) {
        return Message.badRequest(res, {
          message: "CANNOT_DELETE_ID",
        });
      }

      const anchor = await prisma.anchor.delete({ where: { id } });
      return Message.ok(res, `DELETE_ANCHOR_${id}_IS_SUCCESS`, anchor);
    } catch (error: any) {
      console.error(error);
      return Message.unprocessable(res, { message: "ERROR_DELETE_ANCHOR" });
    }
  }
}
