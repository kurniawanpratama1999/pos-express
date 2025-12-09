import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
export class UserController {
  public static index(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
      success: true,
      message: "berhasil ambil data",
    });
  }

  public static async store(req: Request, res: Response) {
    try {
      const data = req.body;

      if (!data.email || !data.password || !data.name) {
        return res.status(400).json({
          success: false,
          message: "BadRequest: ada data yang tidak terisi",
          data: null,
        });
      }

      const user = await prisma.user.create({ data });
      const { password, deleted_at, ...results } = user;

      return res.status(200).json({
        success: true,
        message: "berhasil tambah data",
        data: results,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}
