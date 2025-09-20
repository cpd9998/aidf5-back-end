import express from "express";
import { createReview, getReviewForHotel } from "../application/review";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("/hotel/:hotelId", getReviewForHotel);

export default reviewRouter;
