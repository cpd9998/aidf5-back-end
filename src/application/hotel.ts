import Hotel from "../infrastructure/entities/Hotel";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "../api/domain/errors/index";
import { Request, Response, NextFunction } from "express";

export const getAllHotels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotels = await Hotel.find();
    if (!hotels || hotels.length === 0) {
      throw new NotFoundError("No hotel found");
    }

    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotelData = req.body;
    console.log(hotelData);
    if (
      !hotelData.name ||
      !hotelData.price ||
      !hotelData.desc ||
      !hotelData.city ||
      !hotelData.country ||
      !hotelData.image
    ) {
      throw new ValidationError("Missing required fields");
    }
    const newHotel = new Hotel(hotelData);
    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getHotelById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Request Params ID:", req.params.id); // Debugging line
    const _id = req.params.id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    if (
      !req.body.name ||
      !req.body.location ||
      !req.body.price ||
      !req.body.description
    ) {
      throw new ValidationError("Missing required fields");
    }
    const hotel = await Hotel.findByIdAndUpdate(_id, req.body, { new: true });
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const patchHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const updateData = req.body;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    await Hotel.findByIdAndUpdate(_id, { price: updateData.price });
    res.status(200).json({ message: "Hotel price updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const hotel = await Hotel.findByIdAndDelete(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    next(error);
  }
};
