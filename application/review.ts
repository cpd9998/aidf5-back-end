import Review from "../infrastructure/entities/Review";
import Hotel from "../infrastructure/entities/Hotel";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "../api/domain/errors/index";

import { Request, Response, NextFunction } from "express";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewData = req.body;
    if (!reviewData.rating || !reviewData.comment || !reviewData.hotelId) {
      throw new ValidationError("Missing required fields");
    }
    const hotel = await Hotel.findById(reviewData.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    const review = await Review.create({
      rating: reviewData.rating,
      comment: reviewData.comment,
    });
    hotel.review.push(review._id);
    await hotel.save();

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    next(error);
  }
};

export const getReviewForHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId).populate("review");
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    res.status(200).json(hotel.review);
  } catch (error) {
    next(error);
  }
};
