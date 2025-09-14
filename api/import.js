import express from "express";
import {importHotel} from "../application/import.js";


const importRouter = express.Router();

importRouter.get("/", importHotel);

export default importRouter;
