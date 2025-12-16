import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class CategoryController {
  public static async index(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany();
      return Message.ok(res, "Fetch categories is success", categories);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const category = await prisma.category.findUnique({ where: { id } });
      return Message.ok(res, `Fetch category by id-${id} is success`, category);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async store(req: Request, res: Response) {
    try {
      const data = req.body;
      const storeData = await prisma.category.create({
        data: { name: data.name },
      });
      return Message.ok(res, `Store category is success`, storeData);
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
  public static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updateData = await prisma.category.update({
        data: { name: data.name },
        where: { id },
      });
      return Message.ok(
        res,
        `Update category with id-${id} is success`,
        updateData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const destroyData = await prisma.category.delete({ where: { id } });
      return Message.ok(
        res,
        `Update category with id-${id} is success`,
        destroyData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
}
