import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";
import { Prisma } from "../../../generated/prisma/client";

export class AnchorController {
  public static async index(req: Request, res: Response) {
    try {
      const anchors = await prisma.anchor.findMany();
      return Message.ok({ res, code: "ANCHOR_FETCH_SUCCESS", data: anchors });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "ANCHOR_FETCH_FAILED",
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
          code: "ANCHOR_ID_NOT_FOUND",
        });
      }

      const anchor = await prisma.anchor.findUnique({ where: { id } });

      if (!anchor) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ANCHOR_NOT_FOUND",
        });
      }

      return Message.ok({ res, code: "ANCHOR_FETCH_SUCCESS", data: anchor });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "ANCHOR_FETCH_FAILED",
      });
    }
  }

  public static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      await prisma.anchor.create({
        data: {
          name: body.name,
          icon: body.icon,
          url: body.url,
        },
      });

      return Message.created({
        res,
        code: "ANCHOR_CREATE_SUCCESS",
        data: null,
      });
    } catch (error: any) {
      console.error(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            // "Unique constraint failed on the {constraint}"
            return Message.fail({
              res,
              status: "conflict",
              code: "ANCHOR_ALREADY_EXISTS",
            });
          case "P2003":
            // "Foreign key constraint failed on the field: {field_name}"
            return Message.fail({
              res,
              status: "badRequest",
              code: "ANCHOR_INVALID_RELATION",
            });
          case "P2014":
            // "The change you are trying to make would violate the required relation
            // '{relation_name}' between the {model_a_name} and {model_b_name} models."
            return Message.fail({
              res,
              status: "conflict",
              code: "ANCHOR_RELATION_CONSTRAINT",
            });
        }
      }

      return Message.fail({
        res,
        status: "error",
        code: "ANCHOR_CREATE_FAILED",
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
          code: "ANCHOR_ID_NOT_FOUND",
        });
      }

      const body = req.body;

      const anchor = await prisma.anchor.update({
        data: {
          name: body.name,
          icon: body.icon,
          url: body.url,
        },
        where: { id },
      });

      if (!anchor) {
        return Message.fail({
          res,
          status: "notFound",
          code: "ANCHOR_NOT_FOUND",
        });
      }

      return Message.ok({ res, code: "ANCHOR_UPDATE_SUCCESS", data: null });
    } catch (error: any) {
      console.error(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            // "An operation failed because it depends on one or more records
            // that were required but not found. {cause}"
            return Message.fail({
              res,
              status: "notFound",
              code: "ANCHOR_NOT_FOUND",
            });
        }
      }

      return Message.fail({
        res,
        status: "error",
        code: "ANCHOR_UPDATE_FAILED",
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
          code: "ANCHOR_ID_NOT_FOUND",
        });
      }

      if (id <= 3) {
        return Message.fail({
          res,
          status: "badRequest",
          code: "ANCHOR_DELETE_FAILED",
        });
      }

      const anchor = await prisma.anchor.delete({ where: { id } });

      return Message.ok({ res, code: "ANCHOR_DELETE_SUCCESS", data: null });
    } catch (error: any) {
      console.error(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            // "An operation failed because it depends on one or more records
            // that were required but not found. {cause}"
            return Message.fail({
              res,
              status: "notFound",
              code: "ANCHOR_NOT_FOUND",
            });
        }
      }

      return Message.fail({
        res,
        status: "error",
        code: "ANCHOR_DELETE_FAILED",
      });
    }
  }
}
