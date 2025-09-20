import Hotel from "../infrastructure/entities/Hotel";
import Review from "../infrastructure/entities/Review";
import { hotels } from "../util/hotel-list";
import { Request, Response, NextFunction } from "express";

export const importHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("hotels", hotels);

    for (let hotel of hotels) {
      const newHotelList = new Hotel(hotel);
      await newHotelList.save();
    }
    res.status(201).json({ message: "Hotel list  created successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error creating review", error: error.message });
    }
  }
};
