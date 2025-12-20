import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

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
      return Message.ok({
        res,
        code: "PRODUCT_FETCH_SUCCESS",
        data: products,
      });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "PRODUCT_FETCH_FAILED",
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
          code: "PRODUCT_ID_NOT_FOUND",
        });
      }
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return Message.fail({
          res,
          status: "notFound",
          code: "PRODUCT_NOT_FOUND",
        });
      }
      return Message.ok({
        res,
        code: "PRODUCT_FETCH_SUCCESS",
        data: product,
      });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "PRODUCT_FETCH_FAILED",
      });
    }
  }
  public static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      await prisma.product.create({
        data: {
          categoryId: body.categoryId,
          name: body.name,
          price: body.price,
          description: body.description,
        },
      });
      return Message.created({
        res,
        code: "PRODUCT_CREATE_SUCCESS",
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
              code: "PRODUCT_ALREADY_EXISTS",
            });
          case "P2003":
            // "Foreign key constraint failed on the field: {field_name}"
            return Message.fail({
              res,
              status: "badRequest",
              code: "PRODUCT_INVALID_RELATION",
            });
          case "P2014":
            // "The change you are trying to make would violate the required relation
            // '{relation_name}' between the {model_a_name} and {model_b_name} models."
            return Message.fail({
              res,
              status: "conflict",
              code: "PRODUCT_RELATION_CONSTRAINT",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "PRODUCT_CREATE_FAILED",
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
          code: "PRODUCT_ID_NOT_FOUND",
        });
      }

      const data = req.body;

      const product = await prisma.product.update({
        data: {
          categoryId: data.categoryId,
          name: data.name,
          price: data.price,
          description: data.description,
        },
        where: { id },
      });

      if (!product) {
        return Message.fail({
          res,
          status: "notFound",
          code: "PRODUCT_ID_NOT_FOUND",
        });
      }

      return Message.ok({ res, code: "PRODUCT_UPDATE_SUCCESS", data: null });
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
              code: "PRODUCT_NOT_FOUND",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "PRODUCT_UPDATE_FAILED",
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
          code: "PRODUCT_ID_NOT_FOUND",
        });
      }
      const product = await prisma.product.delete({ where: { id } });
      if (!product) {
        return Message.fail({
          res,
          status: "notFound",
          code: "PRODUCT_NOT_FOUND",
        });
      }
      return Message.ok({ res, code: "PRODUCT_DELETE_SUCCESS", data: null });
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
              code: "PRODUCT_NOT_FOUND",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "PRODUCT_DELETE_FAILED",
      });
    }
  }
}
