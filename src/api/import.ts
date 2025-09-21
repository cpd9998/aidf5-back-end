import express from "express";
import { importHotel } from "../application/import";

const importRouter = express.Router();

importRouter.get("/", importHotel);

export default importRouter;
