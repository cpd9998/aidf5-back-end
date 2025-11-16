import express from "express";
import { getAllHotelsByQuey } from "../application/pagination";

const paginationRouter = express.Router();

paginationRouter.route("/hotels").get(getAllHotelsByQuey);

export default paginationRouter;
