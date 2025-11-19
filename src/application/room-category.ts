import { Request, Response, NextFunction } from "express";
import { CreateRoomCategoryDto } from "../api/domain/dtos/room-category";
import { NotFoundError, ValidationError } from "../api/domain/errors";
import { RoomCategory } from "../infrastructure/entities/RoomCategory";
import { uploadMultipleImagesToS3 } from "../util/uploadMultipleImage";
export const createRoomCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    console.log("files", files);
    console.log("body", req.body);

    let imageUrls: string[] = [];
    if (files) {
      imageUrls = await uploadMultipleImagesToS3(files);
    }

    const roomCategoryData = {
      ...req.body,
      basePrice: Number(req.body.basePrice),
      maxAdults: Number(req.body.maxAdults),
      images: imageUrls,
    };

    const result = CreateRoomCategoryDto.safeParse(roomCategoryData);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }

    const newRoomCategory = new RoomCategory({ ...result.data });
    await newRoomCategory.save();
    res.status(201).json(newRoomCategory);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllRoomCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.hotelId ? { hotelId: req.query.hotelId } : {};

    const hoteCategories = await RoomCategory.find(query);

    if (!hoteCategories || hoteCategories.length === 0) {
      throw new NotFoundError("No hotel categories found");
    }

    res.status(200).json(hoteCategories);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getRoomCategorylById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const hotel = await RoomCategory.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Room Category not found");
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateRoomCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const hotelData = req.body;
    const result = CreateRoomCategoryDto.safeParse(hotelData);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }
    const roomCategory = await RoomCategory.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!roomCategory) {
      throw new NotFoundError("Room Category found");
    }
    res.status(200).json(roomCategory);
  } catch (error) {
    next(error);
  }
};

export const patchRoomCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const updateData = req.body;
    const hotel = await RoomCategory.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Rooom category not found");
    }
    await RoomCategory.findByIdAndUpdate(_id, {
      basePrice: updateData.basePrice,
    });
    res
      .status(200)
      .json({ message: "Room Category price updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteRoomCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const hotel = await RoomCategory.findByIdAndDelete(_id);
    if (!hotel) {
      throw new NotFoundError("Room Category not found");
    }
    res.status(200).json({ message: "Room category  deleted successfully" });
  } catch (error) {
    next(error);
  }
};
