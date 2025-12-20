import { Response } from "express";
const HTTP_ERROR = {
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  unprocessable: 422,
  error: 500,
} as const;

interface Ok<T> {
  res: Response;
  code: string;
  data: T | null;
}

interface Fail {
  res: Response;
  code: string;
  status: keyof typeof HTTP_ERROR;
  errors?: unknown;
}

export class Message {
  public static ok<T>(params: Ok<T>) {
    const { res, code, data } = params;
    return res.status(200).json({
      success: true,
      code,
      data,
    });
  }

  public static created<T>(params: Ok<T>) {
    const { res, code, data } = params;
    return res.status(201).json({
      success: true,
      code,
      data,
    });
  }

  public static fail(params: Fail) {
    const { res, code, status } = params;
    return res.status(HTTP_ERROR[status]).json({
      success: false,
      code,
      data: null,
    });
  }
}
