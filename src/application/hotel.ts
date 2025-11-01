import Hotel from "../infrastructure/entities/Hotel";
import { ValidationError, NotFoundError } from "../api/domain/errors/index";
import { Request, Response, NextFunction } from "express";

import { CreateHotelDto, SearchHotelsDto } from "../api/domain/dtos/hotel";
import { embed } from "../util/embedding";

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
    console.log(error);
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
    const result = CreateHotelDto.safeParse(hotelData);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }
    const embedding = await embed(
      `${result.data.name} ${result.data.city} ${result.data.country} ${result.data.desc} ${result.data.price}`
    );

    console.log(result.data.name, embedding);

    const newHotel = new Hotel({ ...result.data, embedding });
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
    console.log("getHotelsBySearch called"); // Debugging line
    console.log("Request Params ID:", req.params.id); // Debugging line
    const _id = req.params.id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.log(error);
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
    const hotelData = req.body;
    const result = CreateHotelDto.safeParse(hotelData);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
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

export const seedHotelsWithEmbedding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotels = await Hotel.find();

    if (hotels.length > 0) {
      const hotelEmbeddings = hotels.map(async (hotel) => {
        const embedding = await embed(
          `${hotel.name} ${hotel.city} ${hotel.country} ${hotel.desc} ${hotel.price}`
        );
        return { ...hotel, embedding: embedding };
      });

      hotelEmbeddings.forEach(async (hotel: any) => {
        await Hotel.findByIdAndUpdate(hotel._id, {
          embedding: hotel.embedding,
        });
      });
    }
    return res
      .status(200)
      .json({ message: "Hotels seeded with embedding successfully" });
  } catch (error) {
    console.log(error);
    throw new Error("Error seeding hotels");
  }
};
