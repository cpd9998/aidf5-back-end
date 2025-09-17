import express from "express";
import {
  getAllHotels,
  createHotel,
  getHotelById,
  updateHotel,
  patchHotel,
  deleteHotel,
} from "../application/hotel.js";
import isAuthenticated from "./middleware/authentication-middleware.js";

const hotelRouter = express.Router();

hotelRouter.route("/").get(getAllHotels).post(createHotel);

hotelRouter
  .route("/:id")
  .get(getHotelById)
  .put(updateHotel)
  .patch(patchHotel)
  .delete(deleteHotel);

export default hotelRouter;
