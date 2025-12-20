import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class DetailController {
  public static async index(req: Request, res: Response) {
    try {
      const details = await prisma.orderDetail.findMany();
      return Message.ok({
        res,
        code: "ORDER_DETAIL_FETCH_SUCCESS",
        data: details,
      });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "ORDER_DETAIL_FETCH_FAILED",
      });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return Message.fail({
          res,
          status: "error",
          code: "ORDER_DETAIL_ID_NOT_FOUND",
        });
      }
      const detail = await prisma.orderDetail.findUnique({ where: { id } });

      if (!detail) {
        return Message.fail({
          res,
          status: "error",
          code: "ORDER_DETAIL_NOT_FOUND",
        });
      }

      return Message.ok({
        res,
        code: "ORDER_DETAIL_FETCH_SUCCESS",
        data: detail,
      });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "ORDER_DETAIL_FETCH_FAILED",
      });
    }
  }
}
