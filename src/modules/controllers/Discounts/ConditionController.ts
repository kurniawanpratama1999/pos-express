import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class ConditionController {
  public static async index(req: Request, res: Response) {
    try {
      const conditions = await prisma.discountCondition.findMany();
      return Message.ok(
        res,
        "Fetch discount conditions is success",
        conditions
      );
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const condition = await prisma.discountCondition.findUnique({
        where: { id },
      });
      return Message.ok(
        res,
        `Fetch discount condition by id-${id} is success`,
        condition
      );
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }
  public static async store(req: Request, res: Response) {
    try {
      const data = req.body;
      const storeData = await prisma.discountCondition.create({ data });
      return Message.ok(res, `Store discount condition is success`, storeData);
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
  public static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updateData = await prisma.discountCondition.update({
        data,
        where: { id },
      });
      return Message.ok(
        res,
        `Update discount condition with id-${id} is success`,
        updateData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const destroyData = await prisma.discountCondition.delete({
        where: { id },
      });
      return Message.ok(
        res,
        `Update discount condition with id-${id} is success`,
        destroyData
      );
    } catch (error: any) {
      return Message.unprocessable(res, { message: error.message });
    }
  }
}
