import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class ConditionController {
  public static async index(req: Request, res: Response) {
    try {
      const conditions = await prisma.discountCondition.findMany();
      return Message.ok({
        res,
        code: "DISCOUNT_CONDITION_FETCH_SUCCESS",
        data: conditions,
      });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "DISCOUNT_CONDITION_FETCH_FAILED",
      });
    }
  }
  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return Message.fail({
          res,
          status: "notFound",
          code: "DISCOUNT_CONDITION_ID_NOT_FOUND",
        });
      }

      const condition = await prisma.discountCondition.findUnique({
        where: { id },
      });

      if (!condition) {
        return Message.fail({
          res,
          status: "notFound",
          code: "DISCOUNT_CONDITION_NOT_FOUND",
        });
      }

      return Message.ok({
        res,
        code: "DISCOUNT_CONDITION_FETCH_SUCCESS",
        data: null,
      });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "DISCOUNT_CONDITION_FETCH_FAILED",
      });
    }
  }
  public static async store(req: Request, res: Response) {
    try {
      const body = req.body;

      await prisma.discountCondition.create({
        data: {
          productId: body.productId,
          discountId: body.discountId,
          min_quantity: body.min_quantity,
        },
      });

      return Message.created({
        res,
        code: "DISCOUNT_CONDITION_CREATE_SUCCESS",
        data: null,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            // "Unique constraint failed on the {constraint}"
            return Message.fail({
              res,
              status: "conflict",
              code: "DISCOUNT_CONDITION_ALREADY_EXISTS",
            });
          case "P2003":
            // "Foreign key constraint failed on the field: {field_name}"
            return Message.fail({
              res,
              status: "badRequest",
              code: "DISCOUNT_CONDITION_INVALID_RELATION",
            });
          case "P2014":
            // "The change you are trying to make would violate the required relation
            // '{relation_name}' between the {model_a_name} and {model_b_name} models."
            return Message.fail({
              res,
              status: "conflict",
              code: "DISCOUNT_CONDITION_RELATION_CONSTRAINT",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "DISCOUNT_CONDITION_CREATE_FAILED",
      });
    }
  }
  public static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return Message.fail({
          res,
          status: "notFound",
          code: "DISCOUNT_CONDITION_ID_NOT_FOUND",
        });
      }

      const body = req.body;

      const condition = await prisma.discountCondition.update({
        data: {
          productId: body.productId,
          discountId: body.discountId,
          min_quantity: body.min_quantity,
        },
        where: { id },
      });

      if (!condition) {
        return Message.fail({
          res,
          status: "notFound",
          code: "DISCOUNT_CONDITION_NOT_FOUND",
        });
      }

      return Message.ok({
        res,
        code: "DISCOUNT_CONDITION_UPDATE_SUCCESS",
        data: null,
      });
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
              code: "DISCOUNT_CONDITION_NOT_FOUND",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "DISCOUNT_CONDITION_UPDATE_FAILED",
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
          code: "DISCOUNT_CONDITION_ID_NOT_FOUND",
        });
      }

      const condition = await prisma.discountCondition.delete({
        where: { id },
      });

      if (!condition) {
        return Message.fail({
          res,
          status: "notFound",
          code: "DISCOUNT_CONDITION_NOT_FOUND",
        });
      }

      return Message.ok({
        res,
        code: "DISCOUNT_CONDITION_DELETE_SUCCESS",
        data: null,
      });
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
              code: "DISCOUNT_CONDITION_NOT_FOUND",
            });
        }
      }

      return Message.fail({
        res,
        status: "error",
        code: "DISCOUNT_CONDITION_DELETE_FAILED",
      });
    }
  }
}
