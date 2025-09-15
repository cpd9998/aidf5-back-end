import Booking from "../infrastructure/entities/Booking.js";
import  {ValidationError,NotFoundError,UnauthorizedError} from '../api/domain/errors/index.js'
export const createBooking = async (req, res,next) => {
  try {
    const bookingData = req.body;
    if (
      !bookingData.userId ||
      !bookingData.hotelId ||
      !bookingData.checkIn ||
      !bookingData.checkOut ||
      !bookingData.roomNumber ||
      !bookingData.paymentStatus
    ) {
        throw  new ValidationError("Missing required fields")
    }

    const newBookig = new Booking(bookingData);
    await newBookig.save();
    res.status(201).json(newBookig);
  } catch (error) {
      next(error);
  }
};

export const getAllBookings = async (req, res,next) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "fname")
      .populate("hotelId", "name");
    res.status(200).json(bookings);
  } catch (error) {

      next(error);
  }
};

export const getBookingById = async (req, res,next) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw  new NotFoundError("Booking not found")
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
      next(error);
  }
};

export const updateBooking = async (req, res,next) => {
  try {
    const bookingId = req.params.bookingId;
    const bookingData = req.body;
    const booking = await Booking.findByIdAndUpdate(bookingId, bookingData, {
      new: true,
    });
    if (!booking) {
        throw  new NotFoundError("Booking not found")
    }
    res.status(200).json(booking);
  } catch (error) {
      next(error);
  }
};

export const deleteBooking = async (req, res,next) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
        throw  new NotFoundError("Booking not found")
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
      next(error);
  }
};
