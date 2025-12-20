import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class OrderController {
  public static async checkout() {}

  public static async index(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany();
      return Message.ok({ res, code: "ORDER_FETCH_SUCCESS", data: orders });
    } catch (error) {
      console.error(error);
      return Message.fail({ res, status: "error", code: "ORDER_FETCH_FAILED" });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ORDER_ID_NOT_FOUND",
        });
      }
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ORDER_NOT_FOUND",
        });
      }
      return Message.ok({ res, code: "ORDER_FETCH_SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      return Message.fail({ res, status: "error", code: "ORDER_FETCH_FAILED" });
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

      if (!transaction) {
        return Message.fail({
          res,
          status: "unprocessable",
          code: "ORDER_CREATE_UNPROCESSABLE",
        });
      }

      return Message.created({ res, code: "ORDER_CREATE_SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            // "Unique constraint failed on the {constraint}"
            return Message.fail({
              res,
              status: "conflict",
              code: "ORDER_ALREADY_EXISTS",
            });
          case "P2003":
            // "Foreign key constraint failed on the field: {field_name}"
            return Message.fail({
              res,
              status: "badRequest",
              code: "ORDER_INVALID_RELATION",
            });
          case "P2014":
            // "The change you are trying to make would violate the required relation
            // '{relation_name}' between the {model_a_name} and {model_b_name} models."
            return Message.fail({
              res,
              status: "conflict",
              code: "ORDER_RELATION_CONSTRAINT",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "ORDER_CREATE_FAILED",
      });
    }
  }
  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ORDER_ID_NOT_FOUND",
        });
      }
      const order = await prisma.order.delete({ where: { id } });
      if (!order) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ORDER_NOT_FOUND",
        });
      }
      return Message.ok({ res, code: "ORDER_DELETE_SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            // "An operation failed because it depends on one or more records
            // that were required but not found. {cause}"
            // Operasi gagal karna ketergantunagan terhadap data yang dibutuhkan tidak ditemukan
            return Message.fail({
              res,
              status: "notFound",
              code: "ORDER_NOT_FOUND",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "ORDER_DELETE_FAILED",
      });
    }
  }
}
