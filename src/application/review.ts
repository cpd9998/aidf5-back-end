import Review from "../infrastructure/entities/Review";
import Hotel from "../infrastructure/entities/Hotel";
import { ValidationError, NotFoundError } from "../api/domain/errors/index";

import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewData = req.body;
    const { userId } = getAuth(req);
    if (!reviewData.rating || !reviewData.comment || !reviewData.hotelId) {
      throw new ValidationError("Missing required fields");
    }
    reviewData.userId = userId;
    const hotel = await Hotel.findById(reviewData.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    const review = await Review.create({
      rating: reviewData.rating,
      comment: reviewData.comment,
      hotelId: reviewData.hotelId,
      userId: reviewData.userId,
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
    const review = await Review.findById(hotelId);
    if (!review) {
      throw new NotFoundError("No reviews found for this hotel");
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};
