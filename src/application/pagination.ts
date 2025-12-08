import { Request, Response, NextFunction } from "express";
import { RoomCategory } from "../infrastructure/entities/RoomCategory";
import { Room } from "../infrastructure/entities/Room";
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

export const getRoomCategoryByQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //load more movies functionality
    const page = Number(req.query.pageNumber) || 1;
    const limit = 2; // 2 movies per page
    const skip = (page - 1) * limit;

    const roomCategories = await RoomCategory.find({})

      .skip(skip)
      .limit(limit);
    if (!roomCategories || roomCategories.length === 0) {
      throw new NotFoundError("No Room Categories found");
    }

    const count = await RoomCategory.countDocuments({});

    res.status(200).json({
      roomCategories,
      totalRoomCategories: count,
      pages: Math.ceil(count / limit),
      page,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getRoomCategoryByHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotelId = req.params.id;
    const page = Number(req.query.pageNumber) || 1;
    const limit = 2; // 2 movies per page
    const skip = (page - 1) * limit;

    const roomCategories = await RoomCategory.find({
      hotelId: hotelId,
    })
      .skip(skip)
      .limit(limit);

    if (roomCategories.length === 0) {
      throw new NotFoundError("No Room Category found");
    }

    const count = await RoomCategory.countDocuments({
      hotelId: hotelId,
    });

    res.status(200).json({
      roomCategories,
      totalRoomCategories: count,
      pages: Math.ceil(count / limit),
      page,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getRoomsByQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotelId = req.query.hotelId;
    const categoryId = req.query.categoryId;
    const page = Number(req.query.pageNumber) || 1;
    const limit = 3; // 2 movies per page
    const skip = (page - 1) * limit;

    console.log("hotelId", hotelId);
    console.log("categoryId", categoryId);

    const query: any = {};
    if (hotelId && categoryId) {
      query.hotelId = hotelId;
      query.categoryId = categoryId;
    }

    const rooms = await Room.find(query)
      .populate("hotelId", "name")
      .populate("categoryId", "name")
      .select("roomNumber status floor")
      .select("name")
      .skip(skip)
      .limit(limit);

    const newRooms = rooms.map((room: any) => ({
      _id: room._id,
      room: room.roomNumber,
      floor: room.floor,
      hotel: {
        _id: room.hotelId._id,
        name: room.hotelId.name,
      },
      category: {
        _id: room.categoryId._id,
        name: room.categoryId.name,
      },
      status: room.status,
    }));

    if (newRooms.length === 0) {
      throw new NotFoundError("No Room Category found");
    }

    const count = await Room.countDocuments({
      hotelId: hotelId,
      categoryId: categoryId,
    });

    console.log("count", count);

    res.status(200).json({
      newRooms,
      totalRooms: count,
      totalPages: Math.ceil(count / limit),
      page,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
