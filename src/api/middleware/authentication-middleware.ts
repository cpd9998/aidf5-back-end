import UnauthorizedError from "../domain/errors/unauthorized-error";
import { Request, Response, NextFunction } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("Auth Object:", req.auth());
  if (!req.auth().isAuthenticated) {
    console.log("User is not authenticated");
    throw new UnauthorizedError("User is not authorized");
  }
  next();
};

export default isAuthenticated;
