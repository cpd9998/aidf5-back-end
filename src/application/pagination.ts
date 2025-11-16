import { Request, Response, NextFunction } from "express";
import Hotel from "../infrastructure/entities/Hotel";
import { NotFoundError } from "../api/domain/errors/index";

export const getAllHotelsByQuey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //load more movies functionality
    const page = Number(req.query.pageNumber) || 1;
    const limit = 3; // 2 movies per page
    const skip = (page - 1) * limit;

    const hotels = await Hotel.find()
      .select("name price desc image")

      .skip(skip)
      .limit(limit);
    if (!hotels || hotels.length === 0) {
      throw new NotFoundError("No hotel found");
    }

    const count = await Hotel.countDocuments({});

    res.status(200).json({
      hotels,
      totalHotels: count,
      pages: Math.ceil(count / limit),
      page,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
