import { Response } from "express";

export class Message {
  public static ok<T>(res: Response, message: string, data: T) {
    return res.status(200).json({
      success: true,
      status: "OK",
      message,
      data,
    });
  }

  public static created<T>(res: Response, message: string, data: T) {
    return res.status(201).json({
      success: true,
      status: "CREATED",
      message,
      data,
    });
  }

  public static badRequest(res: Response, error: any) {
    return res.status(400).json({
      success: false,
      status: "BAD_REQUEST",
      error,
    });
  }

  public static unauthorized(res: Response, error: any) {
    return res.status(401).json({
      success: false,
      status: "UNATHORIZED",
      error,
    });
  }

  public static forbidden(res: Response, error: any) {
    return res.status(403).json({
      success: false,
      status: "FORBIDDEN",
      error,
    });
  }

  public static notfound(res: Response, error: any) {
    return res.status(404).json({
      success: false,
      status: "NOT_FOUND",
      error,
    });
  }

  public static conflict(res: Response, error: any) {
    return res.status(409).json({
      success: false,
      status: "CONFLICT",
      error,
    });
  }

  public static unprocessable(res: Response, error: any) {
    return res.status(422).json({
      success: false,
      status: "UNPROCESSABLE_ENTITIY",
      error,
    });
  }

  public static error(res: Response, error: any) {
    return res.status(500).json({
      success: false,
      status: "INTERNAL_SERVER_ERROR",
      error,
    });
  }
}
