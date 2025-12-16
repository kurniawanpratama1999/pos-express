import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class VariantController {
  public static async index(req: Request, res: Response) {
    try {
      const variants = await prisma.variant.findMany();
      return Message.ok(res, "Fetch variants is success", variants);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const variant = await prisma.variant.findUnique({ where: { id } });
      return Message.ok(res, `Fetch variant by id-${id} is success`, variant);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async store(req: Request, res: Response) {
    try {
      const data = req.body;
      const storeData = await prisma.variant.create({
        data: {
          productId: data.productId,
          name: data.name,
          price: data.price,
          description: data.description,
        },
      });
      return Message.ok(res, `Store variant is success`, storeData);
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
  public static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updateData = await prisma.variant.update({ data, where: { id } });
      return Message.ok(
        res,
        `Update variant with id-${id} is success`,
        updateData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const destroyData = await prisma.variant.delete({ where: { id } });
      return Message.ok(
        res,
        `Update variant with id-${id} is success`,
        destroyData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
}
