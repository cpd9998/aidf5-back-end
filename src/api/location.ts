import express from "express";
import { getAllLocations, createLocations } from "../application/location";
import isAuthenticated from "./middleware/authentication-middleware";

const locationRouter = express.Router();

locationRouter.post("/", isAuthenticated, createLocations);
locationRouter.get("/", getAllLocations);

export default locationRouter;
