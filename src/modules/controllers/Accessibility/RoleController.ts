import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";
import { Prisma } from "../../../generated/prisma/client";

export class RoleController {
  public static async index(req: Request, res: Response) {
    try {
      const query = req.query;
      const qSearch = typeof query.q === "string" ? query.q : undefined;

      const roles = await prisma.role.findMany({
        where: { ...(qSearch && { name: { contains: qSearch } }) },
      });

      return Message.ok({ res, code: "ROLE_FETCH_SUCCESS", data: roles });
    } catch (error) {
      return Message.fail({ res, status: "error", code: "ROLE_FETCH_FAILED" });
    }
  }

  public static async show(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (!id) {
      return Message.fail({
        res,
        status: "notFound",
        code: "ROLE_ID_NOT_FOUND",
      });
    }

    try {
      const role = await prisma.role.findUnique({
        where: { id },
      });

      if (!role) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ROLE_NOT_FOUND",
        });
      }

      return Message.ok({ res, code: "ROLE_FETCH_SUCCESS", data: role });
    } catch (error) {
      return Message.fail({ res, status: "error", code: "ROLE_FETCH_FAILED" });
    }
  }

  public static async store(req: Request, res: Response) {
    try {
      const body = req.body;

      await prisma.role.create({
        data: {
          name: body.name,
        },
      });

      return Message.created({ res, code: "ROLE_CREATE_SUCCESS", data: null });
    } catch (error: any) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            // "Unique constraint failed on the {constraint}"
            return Message.fail({
              res,
              status: "conflict",
              code: "ROLE_ALREADY_EXISTS",
            });
          case "P2003":
            // "Foreign key constraint failed on the field: {field_name}"
            return Message.fail({
              res,
              status: "badRequest",
              code: "ROLE_INVALID_RELATION",
            });
          case "P2014":
            // "The change you are trying to make would violate the required relation
            // '{relation_name}' between the {model_a_name} and {model_b_name} models."
            return Message.fail({
              res,
              status: "conflict",
              code: "ROLE_RELATION_CONSTRAINT",
            });
        }
      }
      return Message.fail({ res, status: "error", code: "ROLE_CREATE_FAILED" });
    }
  }
  public static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ROLE_ID_NOT_FOUND",
        });
      }

      const body = req.body;

      const role = await prisma.role.update({
        where: { id },
        data: { name: body.name },
      });

      if (!role) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ROLE_NOT_FOUND",
        });
      }

      return Message.ok({ res, code: "ROLE_UPDATE_SUCCESS", data: null });
    } catch (error) {
      console.log(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            // "An operation failed because it depends on one or more records
            // that were required but not found. {cause}"
            return Message.fail({
              res,
              status: "notFound",
              code: "ROLE_NOT_FOUND",
            });
        }
      }

      return Message.fail({ res, status: "error", code: "ROLE_UPDATE_FAILED" });
    }
  }

  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ROLE_ID_NOT_FOUND",
        });
      }

      if (id <= 1) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ROLE_DELETE_FAILED",
        });
      }

      const role = await prisma.role.delete({ where: { id } });

      if (!role) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ROLE_NOT_FOUND",
        });
      }
      return Message.ok({ res, code: "ROLE_DELETE_SUCCESS", data: null });
    } catch (error) {
      console.log(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            // "An operation failed because it depends on one or more records
            // that were required but not found. {cause}"
            return Message.fail({
              res,
              status: "notFound",
              code: "ROLE_NOT_FOUND",
            });
        }
      }

      return Message.fail({ res, status: "error", code: "ROLE_DELETE_FAILED" });
    }
  }
}
