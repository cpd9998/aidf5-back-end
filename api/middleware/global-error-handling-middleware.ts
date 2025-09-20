import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../domain/errors/index";

import { Request, Response, NextFunction } from "express";

const globalErrorHandlingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof NotFoundError) {
    res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message,
    });
  } else if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message,
    });
  } else if (error instanceof UnauthorizedError) {
    console.log("UnauthorizedError", error.statusCode);
    res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message,
    });
    res.status(500).json({
      code: error.statusCode,
      message: "Internal Server Error",
    });
  }
};

export default globalErrorHandlingMiddleware;
