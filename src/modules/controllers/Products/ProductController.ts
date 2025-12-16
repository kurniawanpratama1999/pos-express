import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class ProductController {
  public static async index(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        include: {
          variant: true,
          category: true,
          condition: {
            where: {
              discount: {
                is_active: true,
                apply_to: "PRODUCT",
                start_at: { lte: new Date() },
                OR: [{ end_at: null }, { end_at: { gte: new Date() } }],
              },
            },
            include: {
              discount: true,
            },
          },
        },
      });
      return Message.ok(res, "Fetch products is success", products);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }

  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await prisma.product.findUnique({ where: { id } });
      return Message.ok(res, `Fetch product by id-${id} is success`, product);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async store(req: Request, res: Response) {
    try {
      const data = req.body;
      const storeData = await prisma.product.create({
        data: {
          categoryId: data.categoryId,
          name: data.name,
          price: data.price,
          description: data.description,
        },
      });
      return Message.ok(res, `Store product is success`, storeData);
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updateData = await prisma.product.update({
        data: {
          categoryId: data.categoryId,
          name: data.name,
          price: data.price,
          description: data.description,
        },
        where: { id },
      });
      return Message.ok(
        res,
        `Update product with id-${id} is success`,
        updateData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }

  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const destroyData = await prisma.product.delete({ where: { id } });
      return Message.ok(
        res,
        `Update product with id-${id} is success`,
        destroyData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
}
