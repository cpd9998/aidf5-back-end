import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../domain/errors";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const auth: any = getAuth(req);

  console.log("Auth Info:", auth);
  if (auth?.sessionClaims?.metadata?.role !== "admin") {
    throw new ForbiddenError("Forbidden: Admins only");
  }

  next();
};

export default isAdmin;
