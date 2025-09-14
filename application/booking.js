import Booking from "../infrastructure/entities/Booking.js";

export const createBooking = async (req, res) => {
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
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBookig = new Booking(bookingData);
    await newBookig.save();
    res.status(201).json(newBookig);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "fname")
      .populate("hotelId", "name");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const bookingData = req.body;
    const booking = await Booking.findByIdAndUpdate(bookingId, bookingData, {
      new: true,
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
