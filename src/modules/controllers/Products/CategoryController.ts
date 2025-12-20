import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class CategoryController {
  public static async index(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany();
      return Message.ok({
        res,
        code: "CATEGORY_FETCH_SUCCESS",
        data: categories,
      });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "CATEGORY_FETCH_FAILED",
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
          code: "CATEGORY_ID_NOT_FOUND",
        });
      }

      const category = await prisma.category.findUnique({ where: { id } });
      if (!category) {
        return Message.fail({
          res,
          status: "notFound",
          code: "CATEGORY_NOT_FOUND",
        });
      }
      return Message.ok({
        res,
        code: "CATEGORY_FETCH_SUCCESS",
        data: category,
      });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "CATEGORY_FETCH_FAILED",
      });
    }
  }
  public static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      await prisma.category.create({
        data: { name: body.name },
      });
      return Message.created({
        res,
        code: "CATEGORY_CREATE_SUCCESS",
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
              code: "CATEGORY_ALREADY_EXISTS",
            });
          case "P2003":
            // "Foreign key constraint failed on the field: {field_name}"
            return Message.fail({
              res,
              status: "badRequest",
              code: "CATEGORY_INVALID_RELATION",
            });
          case "P2014":
            // "The change you are trying to make would violate the required relation
            // '{relation_name}' between the {model_a_name} and {model_b_name} models."
            return Message.fail({
              res,
              status: "conflict",
              code: "CATEGORY_RELATION_CONSTRAINT",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "CATEGORY_CREATE_FAILED",
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
          code: "CATEGORY_ID_NOT_FOUND",
        });
      }
      const data = req.body;
      const category = await prisma.category.update({
        data: { name: data.name },
        where: { id },
      });

      if (!category) {
        return Message.fail({
          res,
          status: "notFound",
          code: "CATEGORY_ID_NOT_FOUND",
        });
      }
      return Message.ok({ res, code: "CATEGORY_UPDATE_SUCCESS", data: null });
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
              code: "CATEGORY_NOT_FOUND",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "CATEGORY_UPDATE_FAILED",
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
          code: "CATEGORY_ID_NOT_FOUND",
        });
      }
      const category = await prisma.category.delete({ where: { id } });
      if (!category) {
        return Message.fail({
          res,
          status: "notFound",
          code: "CATEGORY_ID_NOT_FOUND",
        });
      }
      return Message.ok({ res, code: "CATEGORY_DELETE_SUCCESS", data: null });
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
              code: "CATEGORY_NOT_FOUND",
            });
        }
      }
      return Message.fail({
        res,
        status: "error",
        code: "CATEGORY_DELETE_FAILED",
      });
    }
  }
}
