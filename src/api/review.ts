import express from "express";
import { createReview, getReviewForHotel } from "../application/review";
import isAuthenticated from "./middleware/authentication-middleware";

const reviewRouter = express.Router();

reviewRouter.post("/", isAuthenticated, createReview);
reviewRouter.get("/hotel/:hotelId", isAuthenticated, getReviewForHotel);

export default reviewRouter;
