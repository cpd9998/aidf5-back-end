import express from "express";
import {
  createBooking,
  checkAvailability,
  updateBookingStatus,
  cancelBooking,
} from "../application/booking";

const bookingRouter = express.Router();

bookingRouter.route("/").post(createBooking);
bookingRouter.route("/availability").get(checkAvailability);

bookingRouter.route("/:id").put(updateBookingStatus).patch(cancelBooking);

export default bookingRouter;
