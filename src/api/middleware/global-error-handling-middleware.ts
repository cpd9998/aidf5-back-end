import { Request, Response, NextFunction } from "express";

const globalErrorHandlingMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "NotFoundError") {
    return res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message,
    });
  } else if (error.name === "ValidationError") {
    return res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message,
    });
  } else if (error.name === "UnauthorizedError") {
    console.log("UnauthorizedError", error.statusCode);
    return res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message,
    });
  } else {
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

export default globalErrorHandlingMiddleware;
