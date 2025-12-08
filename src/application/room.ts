import { Request, Response, NextFunction } from "express";
import { NotFoundError, ValidationError } from "../api/domain/errors";
import { CreateRoomDto } from "../api/domain/dtos/room";
import { Room } from "../infrastructure/entities/Room";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomData = req.body;

    console.log("room data", roomData);
    const result = CreateRoomDto.safeParse(roomData);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }

    const newRoom = new Room({ ...result.data });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hoterooms = await Room.find();
    if (!hoterooms || hoterooms.length === 0) {
      throw new NotFoundError("No hotel rooms  found");
    }
    res.status(200).json(hoterooms);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getRoomlById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const room = await Room.findById(_id)
      .populate({
        path: "hotelId",
        select: "name",
      })
      .populate({
        path: "categoryId",
        select: "name",
      });

    if (!room) {
      throw new NotFoundError("Room Category not found");
    }

    res.status(200).json(room);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const roomData = req.body;
    const result = CreateRoomDto.safeParse(roomData);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }
    const room = await Room.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!room) {
      throw new NotFoundError("Room not found");
    }
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

export const patchRoomStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const updateData = req.body;
    const room = await Room.findById(_id);
    if (!room) {
      throw new NotFoundError("Room not found");
    }
    await Room.findByIdAndUpdate(_id, {
      status: updateData.status,
    });
    res.status(200).json({ message: "Room status  updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const room = await Room.findByIdAndDelete(_id);
    if (!room) {
      throw new NotFoundError("Room not found");
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    next(error);
  }
};
