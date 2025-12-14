import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Message } from "../../utils/Message";

export class RoleController {
  public static async index(req: Request, res: Response) {
    try {
      const roles = await prisma.role.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      return Message.ok(res, "Get all role is success", roles);
    } catch (error) {
      return Message.error(res, {
        message: "Something wrong when fetch roles",
      });
    }
  }

  public static async show(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (!id) {
      return Message.notfound(res, {
        message: "parameter id for role is not found",
      });
    }

    try {
      const role = await prisma.role.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
        },
      });

      return Message.ok(res, `Fetch role with id-${id} is success`, role);
    } catch (error) {
      return Message.error(res, {
        message: "something wrong when get spesific role",
      });
    }
  }

  public static async store(req: Request, res: Response) {
    try {
      const data = req.body;
      const newRole = await prisma.role.create({
        data,
      });

      Message.ok(res, "new role is added", newRole);
    } catch (error: any) {
      Message.unprocessable(res, JSON.parse(error.message));
    }
  }
  public static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return Message.notfound(res, {
          message: "parameter id for role is not found",
        });
      }

      const data = req.body;
      const role = await prisma.role.update({
        where: { id },
        data: data,
      });

      Message.ok(res, `Update role with id-${id} is success`, role);
    } catch (error: any) {
      Message.unprocessable(res, JSON.parse(error.message));
    }
  }

  public static async destroy(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if ([1].includes(id)) {
        return Message.badRequest(res, {
          message: "cannot delete for id 1",
        });
      }

      const roleDelete = await prisma.role.delete({ where: { id } });
      Message.ok(
        res,
        `Delete role and the relation table with roleId ${id} is success`,
        roleDelete
      );
    } catch (error) {
      Message.unprocessable(res, {
        message: "Cannot process your request for delete role",
      });
    }
  }
}
