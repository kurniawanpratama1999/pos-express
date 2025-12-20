import e, { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";
import { Hash } from "../../utils/Hash";
import { Prisma } from "../../../generated/prisma/client";

export class UserController {
  public static async index(req: Request, res: Response) {
    try {
      const query = req.query;
      const qSearch = typeof query.q === "string" ? query.q : undefined;

      let whereCondition: Prisma.UserWhereInput;

      if (qSearch) {
        whereCondition = {
          deleted_at: null,
          OR: [
            {
              name: {
                contains: qSearch,
              },
            },
            {
              email: {
                contains: qSearch,
              },
            },
            {
              role: {
                name: {
                  contains: qSearch,
                },
              },
            },
          ],
        };
      } else {
        whereCondition = {
          deleted_at: null,
        };
      }

      const users = await prisma.user.findMany({
        include: {
          role: {
            select: {
              name: true,
            },
          },
        },
        where: whereCondition,
        omit: { password: true },
      });

      return Message.ok({ res, code: "USER_FETCH_SUCCESS", data: users });
    } catch (error) {
      return Message.fail({ res, status: "error", code: "USER_FETCH_FAILED" });
    }
  }

  public static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return Message.fail({
          res,
          status: "notFound",
          code: "USER_ID_NOT_FOUND",
        });
      }

      const user = await prisma.user.findUnique({
        include: {
          role: {
            select: {
              name: true,
            },
          },
        },
        where: { id },
        omit: { password: true },
      });

      if (!user) {
        return Message.fail({
          res,
          status: "notFound",
          code: "USER_NOT_FOUND",
        });
      }

      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role.name,
      };

      return Message.ok({ res, code: "FETCH_USER_SUCCESS", data });
    } catch (error) {
      console.error(error);
      return Message.fail({ res, status: "error", code: "FETCH_USER_SUCCESS" });
    }
  }

  public static async store(req: Request, res: Response) {
    try {
      const body = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        roleId: req.body.roleId,
      };

      const password_confirmation = req.body.password_confirmation;

      if (password_confirmation !== body.password) {
        return Message.fail({
          res,
          status: "conflict",
          code: "USER_INVALID_VALIDATION",
        });
      }

      body.password = await Hash.make(body.password);

      await prisma.user.create({
        data: body,
        omit: { password: true },
      });

      return Message.created({ res, code: "USER_CREATE_SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            // "Unique constraint failed on the {constraint}"
            return Message.fail({
              res,
              status: "conflict",
              code: "USER_ALREADY_EXISTS",
            });
          case "P2003":
            // "Foreign key constraint failed on the field: {field_name}"
            return Message.fail({
              res,
              status: "badRequest",
              code: "USER_INVALID_RELATION",
            });
          case "P2014":
            // "The change you are trying to make would violate the required relation
            // '{relation_name}' between the {model_a_name} and {model_b_name} models."
            return Message.fail({
              res,
              status: "conflict",
              code: "USER_RELATION_CONSTRAINT",
            });
        }
      }
      return Message.fail({ res, status: "error", code: "USER_CREATE_FAILED" });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return Message.fail({
          res,
          status: "notFound",
          code: "USER_ID_NOT_FOUND",
        });
      }

      const body: {
        name: string;
        email: string;
        roleId: number;
        password?: string;
        password_confirmation?: string;
      } = {
        name: req.body.name,
        email: req.body.email,
        roleId: req.body.roleId,
      };

      if (body.password && body.password_confirmation) {
        if (body.password !== body.password_confirmation) {
          return Message.fail({
            res,
            status: "conflict",
            code: "USER_INVALID_VALIDATION",
          });
        }

        body.password = await Hash.make(body.password);
      }

      const user = await prisma.user.update({
        data: body,
        where: { id },
      });

      if (!user) {
        return Message.fail({
          res,
          status: "notFound",
          code: "USER_NOT_FOUND",
        });
      }

      return Message.ok({ res, code: "USER_UPDATE_SUCCESS", data: null });
    } catch (error) {
      console.error(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            // "An operation failed because it depends on one or more records
            // that were required but not found. {cause}"
            return Message.fail({
              res,
              status: "notFound",
              code: "USER_NOT_FOUND",
            });
        }
      }

      return Message.fail({ res, status: "error", code: "USER_UPDATE_FAILED" });
    }
  }

  public static async softDelete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return Message.fail({
          res,
          status: "notFound",
          code: "USER_ID_NOT_FOUND",
        });
      }

      if (id <= 1) {
        return Message.fail({
          res,
          status: "badRequest",
          code: "USER_SOFT_DELETE_FAILED",
        });
      }

      const user = await prisma.user.update({
        data: { deleted_at: new Date() },
        where: { id },
        select: {
          email: true,
          updated_at: true,
        },
      });

      if (!user) {
        return Message.fail({
          res,
          status: "notFound",
          code: "USER_NOT_FOUND",
        });
      }

      return Message.ok({ res, code: "USER_SOFT_DELETE_SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "USER_SOFT_DELETE_FAILED",
      });
    }
  }

  public static async restore(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return Message.fail({
          res,
          status: "notFound",
          code: "USER_ID_NOT_FOUND",
        });
      }

      const user = await prisma.user.update({
        data: { deleted_at: null },
        where: { id },
        select: {
          email: true,
          updated_at: true,
        },
      });

      if (!user) {
        return Message.fail({
          res,
          status: "notFound",
          code: "USER_NOT_FOUND",
        });
      }

      return Message.ok({ res, code: "USER_RESTORE_SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "USER_RESTORE_FAILED",
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
          code: "USER_ID_NOT_FOUND",
        });
      }

      if (id <= 1) {
        return Message.fail({
          res,
          status: "badRequest",
          code: "USER_DELETE_FAILED",
        });
      }

      const user = await prisma.user.delete({
        where: { id },
        omit: { password: true },
      });

      if (!user) {
        return Message.fail({
          res,
          status: "badRequest",
          code: "USER_NOT_FOUND",
        });
      }

      return Message.ok({ res, code: "USER_DELETE_SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      return Message.fail({
        res,
        status: "error",
        code: "USER_DELETE_FAILED",
      });
    }
  }
}
