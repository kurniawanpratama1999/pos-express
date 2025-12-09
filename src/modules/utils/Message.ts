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

  public static badRequest(res: Response, error: any) {
    return res.status(400).json({
      success: false,
      status: "Bad Request!",
      error,
    });
  }

  public static unauthorized(res: Response, error: any) {
    return res.status(401).json({
      success: false,
      status: "Unauthorized!",
      error,
    });
  }

  public static forbidden(res: Response, error: any) {
    return res.status(403).json({
      success: false,
      status: "Forbidden!",
      error,
    });
  }

  public static notfound(res: Response, error: any) {
    return res.status(404).json({
      success: false,
      status: "Not Found!",
      error,
    });
  }

  public static conflict(res: Response, error: any) {
    return res.status(409).json({
      success: false,
      status: "Conflict!",
      error,
    });
  }

  public static unprocessable(res: Response, error: any) {
    return res.status(422).json({
      success: false,
      status: "Unprocessable Entity!",
      error,
    });
  }

  public static error(res: Response, error: any) {
    return res.status(500).json({
      success: false,
      status: "Internal Server Error!",
      error,
    });
  }
}
