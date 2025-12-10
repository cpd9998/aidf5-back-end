import express from "express";
import {
  getAllHotelsByQuey,
  getRoomCategoryByQuery,
  getRoomCategoryByHotel,
  getRoomsByQuery,
  getBookingsByQuery,
} from "../application/pagination";

const paginationRouter = express.Router();

paginationRouter.route("/hotels").get(getAllHotelsByQuey);
paginationRouter.route("/room-category").get(getRoomCategoryByQuery);
paginationRouter.route("/room-category/:id").get(getRoomCategoryByHotel);
paginationRouter.route("/room").get(getRoomsByQuery);
paginationRouter.route("/bookings").get(getBookingsByQuery);

export default paginationRouter;
