import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class VariantController {
  public static async index(req: Request, res: Response) {
    try {
      const variants = await prisma.variant.findMany();
      return Message.ok({ res, code: "VARIANT_FETCH_SUCCESS", data: variants });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "VARIANT_FETCH_FAILED",
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
          code: "VARIANT_ID_NOT_FOUND",
        });
      }
      const variant = await prisma.variant.findUnique({ where: { id } });
      if (!variant) {
        return Message.fail({
          res,
          status: "notFound",
          code: "VARIANT_NOT_FOUND",
        });
      }
      return Message.ok({ res, code: "VARIANT_FETCH_SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "VARIANT_FETCH_FAILED",
      });
    }
  }
  public static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      const storeData = await prisma.variant.create({
        data: {
          productId: body.productId,
          name: body.name,
          price: body.price,
          description: body.description,
        },
      });
      return Message.ok({ res, code: "VARIANT_CREATE_SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            // "Unique constraint failed on the {constraint}"
            return Message.fail({
              res,
              status: "conflict",
              code: "VARIANT_ALREADY_EXISTS",
            });
          case "P2003":
            // "Foreign key constraint failed on the field: {field_name}"
            return Message.fail({
              res,
              status: "badRequest",
              code: "VARIANT_INVALID_RELATION",
            });
          case "P2014":
            // "The change you are trying to make would violate the required relation
            // '{relation_name}' between the {model_a_name} and {model_b_name} models."
            return Message.fail({
              res,
              status: "conflict",
              code: "VARIANT_RELATION_CONSTRAINT",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "VARIANT_CREATE_FAILED",
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
          code: "VARIANT_ID_NOT_FOUND",
        });
      }

      const body = req.body;
      const variant = await prisma.variant.update({
        data: {
          productId: body.productId,
          name: body.name,
          price: body.price,
          description: body.description,
        },
        where: { id },
      });

      if (!variant) {
        return Message.fail({
          res,
          status: "notFound",
          code: "VARIANT_NOT_FOUND",
        });
      }

      return Message.ok({ res, code: "VARIANT_UPDATE_SUCCESS", data: null });
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
              code: "VARIANT_NOT_FOUND",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "VARIANT_UPDATE_FAILED",
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
          code: "VARIANT_ID_NOT_FOUND",
        });
      }
      const variant = await prisma.variant.delete({ where: { id } });
      if (!variant) {
        return Message.fail({
          res,
          status: "notFound",
          code: "VARIANT_NOT_FOUND",
        });
      }
      return Message.ok({ res, code: "VARIANT_DELETE_SUCCESS", data: null });
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
              code: "VARIANT_NOT_FOUND",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "VARIANT_DELETE_FAILED",
      });
    }
  }
}
