import express from "express";
import {
  getAllHotelsByQuey,
  getRoomCategoryByQuery,
  getRoomCategoryByHotel,
} from "../application/pagination";

const paginationRouter = express.Router();

paginationRouter.route("/hotels").get(getAllHotelsByQuey);
paginationRouter.route("/room-category").get(getRoomCategoryByQuery);
paginationRouter.route("/room-category/:id").get(getRoomCategoryByHotel);

export default paginationRouter;
