import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class DiscountController {
  public static async index(req: Request, res: Response) {
    try {
      const discounts = await prisma.discount.findMany();
      return Message.ok(res, "Fetch discounts is success", discounts);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const discount = await prisma.discount.findUnique({ where: { id } });
      return Message.ok(res, `Fetch discount by id-${id} is success`, discount);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async store(req: Request, res: Response) {
    try {
      const data = req.body;
      const storeData = await prisma.discount.create({ data });
      return Message.ok(res, `Store discount is success`, storeData);
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
  public static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updateData = await prisma.discount.update({ data, where: { id } });
      return Message.ok(
        res,
        `Update discount with id-${id} is success`,
        updateData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const destroyData = await prisma.discount.delete({ where: { id } });
      return Message.ok(
        res,
        `Update discount with id-${id} is success`,
        destroyData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
}
