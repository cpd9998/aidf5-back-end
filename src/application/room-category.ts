import { Request, Response, NextFunction } from "express";
import { CreateRoomCategoryDto } from "../api/domain/dtos/room-category";
import { NotFoundError, ValidationError } from "../api/domain/errors";
import { RoomCategory } from "../infrastructure/entities/RoomCategory";
import { uploadMultipleImagesToS3 } from "../util/uploadMultipleImage";
import { string } from "zod";
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
    const hotel = await RoomCategory.findById(_id).populate({
      path: "hotelId",
      select: "name",
    });
    if (!hotel) {
      throw new NotFoundError("Room Category not found");
    }

    console.log("hotel", hotel);
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
    const newFiles: any = req.files || [];

    if (hotelData.amenities && typeof hotelData.amenities === "string") {
      hotelData.amenities = [hotelData.amenities];
    }

    hotelData.basePrice = Number(hotelData.basePrice);
    hotelData.maxAdults = Number(hotelData.maxAdults);

    // Find existing room category
    const existingCategory = await RoomCategory.findById(_id);
    if (!existingCategory) {
      throw new NotFoundError("Room Category not found");
    }

    // Handle images
    let updatedImages: string[] = [];
    let existingImages: string[] = [];

    if (hotelData.images) {
      if (typeof hotelData.images === "string") {
        // Try to parse as JSON first
        try {
          const parsed = JSON.parse(hotelData.images);
          existingImages = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // If parsing fails, treat it as a single URL or comma-separated URLs
          existingImages = hotelData.images.includes(",")
            ? hotelData.images.split(",").map((img: string) => img.trim())
            : [hotelData.images];
        }
      } else if (Array.isArray(hotelData.images)) {
        existingImages = hotelData.images;
      } else {
        // Single object/value
        existingImages = [hotelData.images];
      }
    }

    updatedImages = [...existingImages];

    let imageUrls: string[] = [];
    if (newFiles && newFiles.length > 0) {
      imageUrls = await uploadMultipleImagesToS3(newFiles);
      updatedImages = [...updatedImages, ...imageUrls];
    }

    // Delete removed images from storage

    const imagesToDelete = existingCategory.images.filter(
      (img: string) => !existingImages.includes(img)
    );

    hotelData.images = updatedImages;

    const result = CreateRoomCategoryDto.safeParse(hotelData);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }

    // Update the room category with new data and images
    const updateData = {
      ...hotelData,
      images: updatedImages,
    };

    console.log("updateDataaaaaaa", updateData);

    delete updateData.existingImages;

    const roomCategory = await RoomCategory.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: roomCategory,
    });
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
