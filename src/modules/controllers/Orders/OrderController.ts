import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class OrderController {
  public static async checkout() {}

  public static async index(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany();
      return Message.ok(res, "Fetch orders is success", orders);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const order = await prisma.order.findUnique({ where: { id } });
      return Message.ok(res, `Fetch order by id-${id} is success`, order);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async store(req: Request, res: Response) {
    try {
      const dataOrder = req.body.order;
      const dataDetail = req.body.detail;

      const transaction = await prisma.$transaction(async (trx) => {
        const order = await trx.order.create({
          data: {
            code: dataOrder.code,
            subtotal: dataOrder.subtotal,
            discount: dataOrder.discount,
            tax: dataOrder.tax,
            total: dataOrder.total,
            payment: dataOrder.payment,
            change: dataOrder.change,
          },
        });

        const modifyDetail = dataDetail.map((d: object) => ({
          ...d,
          orderId: order.id,
        }));

        const detail = await trx.orderDetail.createMany({ data: modifyDetail });

        return detail;
      });
      return Message.ok(res, `Store order is success`, transaction);
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const destroyData = await prisma.order.delete({ where: { id } });
      return Message.ok(
        res,
        `Update order with id-${id} is success`,
        destroyData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
}
