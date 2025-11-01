import express from "express";
import { getHotelsBySearch } from "../application/search";

const searchRouter = express.Router();

searchRouter.get("/search", getHotelsBySearch);

export default searchRouter;
