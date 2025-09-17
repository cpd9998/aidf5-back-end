import UnauthorizedError from "../domain/errors/unauthorized-error.js";

const isAuthenticated = (req, res, next) => {
  console.log("Auth Object", req.auth().userId);
  if (!req.auth().userId) {
    throw new UnauthorizedError("User is not authorized");
  }
  next();
};

export default isAuthenticated;
