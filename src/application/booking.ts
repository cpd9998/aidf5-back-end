import Booking from "../infrastructure/entities/Booking";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "../api/domain/errors/index";
import { Request, Response, NextFunction } from "express";
import { CreateBookinglDto } from "../api/domain/dtos/booking";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingData = req.body;
    const result = CreateBookinglDto.safeParse(bookingData);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }

    const newBookig = new Booking(bookingData);
    await newBookig.save();
    res.status(201).json(newBookig);
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "fname")
      .populate("hotelId", "name");
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    next(error);
  }
};

export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.bookingId;
    const bookingData = req.body;

    const result = CreateBookinglDto.safeParse(bookingData);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }

    const booking = await Booking.findByIdAndUpdate(bookingId, bookingData, {
      new: true,
    });
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    next(error);
  }
};
