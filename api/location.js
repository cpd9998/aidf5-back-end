import express from "express";
import {getAllLocations,createLocations} from "../application/location.js"

const locationRouter = express.Router();

locationRouter.post("/", createLocations);
locationRouter.get("/", getAllLocations);

export default locationRouter;
