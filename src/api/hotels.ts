import express from "express";
import {
  getAllHotels,
  createHotel,
  getHotelById,
  updateHotel,
  patchHotel,
  deleteHotel,
} from "../application/hotel";
import isAuthenticated from "./middleware/authentication-middleware";
import isAdmin from "./middleware/authorization-middleware";
import { respondToAIQuery } from "../application/ai";

const hotelRouter = express.Router();

hotelRouter.route("/").get(getAllHotels).post(isAdmin, createHotel);

hotelRouter
  .route("/:id")
  .get(isAuthenticated, getHotelById)
  .put(updateHotel)
  .patch(patchHotel)
  .delete(deleteHotel);

hotelRouter.route("/ai").post(respondToAIQuery);

export default hotelRouter;
