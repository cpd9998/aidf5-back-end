import { ValidationError, NotFoundError } from "../api/domain/errors/index";
import { Request, Response, NextFunction } from "express";
import {
  CreateBookingSchemaDto,
  UpdateBookingStatusSchemaDto,
  CancelBookingSchemaDto,
  UpdatePaymentStatusSchemaDto,
} from "../api/domain/dtos/booking";
import { Room } from "../infrastructure/entities/Room";
import { RoomCategory } from "../infrastructure/entities/RoomCategory";
import { Booking } from "../infrastructure/entities/Booking";

export const checkAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { hotelId, checkInDate, checkOutDate, maxAdults, maxChildren } =
      req.query;
    if (!hotelId || !checkInDate || !checkOutDate) {
      throw new ValidationError(
        "hotelId, checkInDate and checkOutDate are required"
      );
    }

    const adults = parseInt(maxAdults as string) || 1;
    const children = parseInt(maxChildren as string) || 0;

    const checkIn = new Date(checkInDate as string);
    const checkOut = new Date(checkOutDate as string);

    if (checkIn >= checkOut) {
      throw new ValidationError("Check-out date must be after check-in date");
    }

    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);

    const categories = await RoomCategory.find({ hotelId });

    if (!categories.length) {
      throw new NotFoundError("No room categories found for this hotel");
    }

    const result: any[] = [];

    for (const category of categories) {
      // Skip category if occupancy does not match
      if (adults > category.maxAdults || children > category.maxChildren) {
        continue;
      }

      // Fetch available rooms
      const rooms = await Room.find({
        hotelId,
        categoryId: category._id,
        status: "Available",
      });

      // Check overlapping bookings
      const overlappingBookings = await Booking.find({
        hotelId,
        categoryId: category._id,
        bookingStatus: { $in: ["Confirmed", "CheckedIn"] },
        $or: [
          { checkInDate: { $lt: checkOut, $gte: checkIn } },
          { checkOutDate: { $gt: checkIn, $lte: checkOut } },
          { checkInDate: { $lte: checkIn }, checkOutDate: { $gte: checkOut } },
        ],
      });

      const bookedRoomIds = overlappingBookings.map((b: any) =>
        b.roomId?.toString()
      );

      const availableRooms = rooms.filter(
        (room) => !bookedRoomIds.includes(room._id.toString())
      );

      if (availableRooms.length === 0) continue;

      // Pricing
      const nights =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

      result.push({
        category: category, // full category object
        pricePerNight: category.basePrice, // only price fields
        totalPrice: category.basePrice * nights,
        availableRoomsCount: availableRooms.length,
        availableRooms: availableRooms, // room list
      });
    }

    res.status(200).json({
      success: true,
      categories: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    hotelId,
    categoryId,
    guestDetails,
    checkInDate,
    checkOutDate,
    numberOfAdults,
    numberOfChildren,
    specialRequests,
  } = req.body;

  try {
    const result = CreateBookingSchemaDto.safeParse(req.body);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }
    // Get available rooms

    const checkIn: any = new Date(checkInDate);
    const checkOut: any = new Date(checkOutDate);

    // Get all rooms in the category
    const allRooms = await Room.find({
      hotelId,
      categoryId,
      status: "Available",
    });

    const availableRooms = [];
    for (const room of allRooms) {
      if (checkIn >= checkOut) {
        throw new ValidationError("Check-out date must be after check-in date");
      }

      if (checkIn < new Date()) {
        throw new ValidationError("Check-in date cannot be in the past");
      }

      // Find overlapping bookings
      const overlappingBookings = await Booking.find({
        _id: room._id,
        bookingStatus: { $in: ["Confirmed", "CheckedIn"] },
        $or: [
          // New booking starts during existing booking
          {
            checkInDate: { $lte: checkIn },
            checkOutDate: { $gt: checkIn },
          },
          // New booking ends during existing booking
          {
            checkInDate: { $lt: checkOut },
            checkOutDate: { $gte: checkOut },
          },
          // New booking completely contains existing booking
          {
            checkInDate: { $gte: checkIn },
            checkOutDate: { $lte: checkOut },
          },
        ],
      });

      if (overlappingBookings.length === 0) {
        availableRooms.push(room);
      }
    }

    if (availableRooms.length === 0) {
      throw new NotFoundError("No rooms available for the selected dates");
    }
    // Assign the first available room
    const assignedRoom = availableRooms[0];

    // Calculate total amount

    const category = await RoomCategory.findById(categoryId);
    if (!category) {
      throw new NotFoundError("Room category not found");
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const totalAmount = category.basePrice * nights;

    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingNumber = `BK${timestamp}${random}`;

    const booking = new Booking({
      bookingNumber,
      hotelId,
      roomId: assignedRoom._id,
      categoryId,
      guestDetails,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      numberOfAdults,
      numberOfChildren: numberOfChildren || 0,
      totalAmount,
      specialRequests,
      bookingStatus: "Confirmed",
      paymentStatus: "Pending",
    });

    await booking.save();

    await Room.findByIdAndUpdate(
      assignedRoom._id,
      { status: "Occupied" },
      { new: true }
    );

    return res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.id;
    const bookingStatus = req.body;
    console.log("bookingStatus", bookingStatus);

    const result = UpdateBookingStatusSchemaDto.safeParse(bookingStatus);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }

    const validStatuses = ["Confirmed", "CheckedIn", "CheckedOut", "NoShow"];

    if (!validStatuses.includes(bookingStatus.status)) {
      throw new ValidationError("Invalid booking status");
    }

    const booking = await Booking.findById(bookingId);

    console.log("booking", booking);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.bookingStatus === bookingStatus.status) {
      throw new ValidationError("it is already cancel");
    }

    if (booking.bookingStatus === "CheckedOut") {
      if (bookingStatus.status === "Confirmed" || "CheckedIn" || "NoShow")
        throw new ValidationError("Cannot update already checked out booking");
    }

    booking.bookingStatus = bookingStatus.status;
    const newBooking = await booking.save();
    res.status(200).json(newBooking);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.id;
    const reason = req.body;

    const result = CancelBookingSchemaDto.safeParse(reason);

    if (!result.success) {
      const errorList = JSON.parse(result.error.message).map((err: any) => {
        return { [err.path[0]]: err.message };
      });

      throw new ValidationError(`${JSON.stringify(errorList)}`);
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.bookingStatus === "Cancelled") {
      throw new ValidationError("Booking is already cancelled");
    }

    if (booking.bookingStatus === "CheckedOut") {
      throw new ValidationError("Cannot cancel a completed booking");
    }

    booking.bookingStatus = "Cancelled";
    booking.cancellationReason = reason.cancellationReason;
    booking.cancelledAt = new Date();

    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
};

export const updatepaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookingId = req.params.id;
  const paymentStatus = req.body;

  const result = UpdatePaymentStatusSchemaDto.safeParse(paymentStatus);

  if (!result.success) {
    const errorList = JSON.parse(result.error.message).map((err: any) => {
      return { [err.path[0]]: err.message };
    });

    throw new ValidationError(`${JSON.stringify(errorList)}`);
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.paymentStatus === "Paid") {
    throw new ValidationError("Booking is already paid");
  }

  if (booking.paymentStatus === ("Paid" as string)) {
    booking.paymentStatus = paymentStatus;
    booking.paymentAt = new Date();
  } else {
    booking.paymentStatus = paymentStatus;
  }

  await booking.save();
  return booking;
};
