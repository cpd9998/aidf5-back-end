import Hotel from "../infrastructure/entities/Hotel";
import { ValidationError, NotFoundError } from "../api/domain/errors/index";
import { Request, Response, NextFunction } from "express";
import { CreateHotelDto } from "../api/domain/dtos/hotel";
import { embed } from "../util/embedding";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import s3 from "../util/s3Config";
import { PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

export const getAllHotels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotels = await Hotel.find().select(
      "_id name city price desc rating review image country "
    );

    if (!hotels || hotels.length === 0) {
      throw new NotFoundError("No hotel found");
    }

    res.status(200).json(hotels);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getHotelBySearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.query;
    let query = {
      ...(name && {
        name: { $regex: name, $options: "i" },
      }),
    };

    const hotels = await Hotel.find(query).select("name _id").limit(3);

    const newHotels = hotels.map((hotel) => {
      return {
        value: hotel.name,
        label: hotel.name,
        id: hotel._id,
      };
    });

    // 4. Send the results
    res.status(200).json(newHotels);
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
    const file = req.file;

    const targetFolder = process.env.HOTEL_FOLDER;
    const mimeType = file?.mimetype;
    const fileName = file?.originalname;
    const fileKey = `${targetFolder}/${uuidv4()}-${fileName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const params: any = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: file?.buffer,
      ContentType: mimeType,
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);

    hotelData.image = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    hotelData.price = Number(hotelData.price);
    const result = CreateHotelDto.safeParse(hotelData);

    console.log(result.data);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }
    const embedding = await embed(
      `${result.data.name} ${result.data.city} ${result.data.country} ${result.data.desc} ${result.data.price}`
    );

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
    let hotelData = req.body;
    hotelData = { ...hotelData, price: Number(hotelData.price) };
    const file = req.file;

    console.log("file", file);

    const targetFolder = process.env.HOTEL_FOLDER;
    const mimeType = file?.mimetype;
    const fileName = file?.originalname;
    const fileKey = `${targetFolder}/${uuidv4()}-${fileName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!file && !hotelData.image) {
      return res.status(400).json({ message: "No image file provided." });
    } else {
      if (file) {
        const params: any = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: file?.buffer,
          ContentType: mimeType,
        };

        const command = new PutObjectCommand(params);

        await s3.send(command);
        hotelData = {
          ...hotelData,
          image: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        };
      }
    }

    const result = CreateHotelDto.safeParse(hotelData);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }
    const hotel = await Hotel.findByIdAndUpdate(_id, hotelData, { new: true });
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
