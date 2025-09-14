import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../application/booking.js";

const bookingRouter = express.Router();

bookingRouter.route("/").post(createBooking).get(getAllBookings);
bookingRouter
  .route("/:bookingId")
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking).delete;

export default bookingRouter;
