import { Request, Response } from "express";
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
        where: {
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
        },

        omit: { password: true },
      });

      return Message.ok(res, "Get all user is success", users);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }

  public static async show(req: Request, res: Response) {
    const id = Number(req.params.id);
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

    return Message.ok(res, `get user with id-${id} is success`, user);
  }

  public static async store(req: Request, res: Response) {
    try {
      const { password_confirmation, ...data } = req.body;

      if (password_confirmation !== data.password) {
        return Message.unprocessable(res, "Password is not the same!");
      }

      data.password = await Hash.make(data.password);

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          roleId: data.roleId,
        },
        omit: { password: true },
      });
      return Message.ok(res, "add user is success", user);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const data = req.body;
      console.log({ data });
      const send: {
        name: string;
        email: string;
        roleId: number;
        password?: string;
      } = {
        name: data.name,
        email: data.email,
        roleId: data.roleId,
      };

      const id = Number(req.params.id);

      if (data.password && data.password_confirmation) {
        if (data.password_confirmation !== data.password) {
          return Message.unprocessable(res, "Password is not the same!");
        }

        send.password = await Hash.make(data.password);
      }

      console.log({ send });
      const user = await prisma.user.update({
        data: { ...send },
        where: { id },
      });
      console.log({ user });
      const { password, ...result } = user;

      return Message.ok(res, `user with id-${id} is updated`, result);
    } catch (error: any) {
      return Message.error(res, { message: error.message });
    }
  }

  public static async softDelete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (id <= 1) {
        return Message.badRequest(res, {
          message: "cannot delete for id 1",
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

      return Message.ok(res, `user with id-${id} is temporary deleted`, user);
    } catch (error) {
      return Message.error(res, { message: "failed to delete user" });
    }
  }

  public static async restore(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await prisma.user.update({
        data: { deleted_at: null },
        where: { id },
        select: {
          email: true,
          updated_at: true,
        },
      });

      return Message.ok(res, `user with id-${id} is success restore`, user);
    } catch (error) {
      return Message.error(res, { message: "failed to restore user" });
    }
  }

  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (id <= 1) {
        return Message.badRequest(res, {
          message: "cannot delete for id 1",
        });
      }

      const user = await prisma.user.delete({
        where: { id },
        omit: { password: true },
      });

      return Message.ok(res, `user with id-${id} is deleted permanently`, user);
    } catch (error) {
      return Message.error(res, { message: "failed to restore user" });
    }
  }
}
