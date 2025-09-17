import express from "express";
import { getAllLocations, createLocations } from "../application/location.js";
import isAuthenticated from "./middleware/authentication-middleware.js";

const locationRouter = express.Router();

locationRouter.post("/", isAuthenticated, createLocations);
locationRouter.get("/", getAllLocations);

export default locationRouter;
