import { Response } from "express";

export class Message {
  public static ok<T>(res: Response, message: string, data: T) {
    return res.status(200).json({
      success: true,
      status: "Ok!",
      message,
      data,
    });
  }

  public static created<T>(res: Response, message: string, data: T) {
    return res.status(201).json({
      success: true,
      status: "Created!",
      message,
      data,
    });
  }

  public static badRequest(res: Response, message: string) {
    return res.status(400).json({
      success: false,
      status: "Bad Request!",
      message,
    });
  }

  public static unauthorized(res: Response, message: string) {
    return res.status(401).json({
      success: false,
      status: "Unauthorized!",
      message,
    });
  }

  public static forbidden(res: Response, message: string) {
    return res.status(403).json({
      success: false,
      status: "Forbidden!",
      message,
    });
  }

  public static notfound(res: Response, message: string) {
    return res.status(404).json({
      success: false,
      status: "Not Found!",
      message,
    });
  }

  public static conflict(res: Response, message: string) {
    return res.status(409).json({
      success: false,
      status: "Conflict!",
      message,
    });
  }

  public static unprocessable(res: Response, message: string) {
    return res.status(422).json({
      success: false,
      status: "Unprocessable Entity!",
      message,
    });
  }

  public static error(res: Response, message: string) {
    return res.status(500).json({
      success: false,
      status: "Internal Server Error!",
      message,
    });
  }
}
