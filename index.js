import express from "express";
import hotelRouter from "./api/hotels.js";
import connectDb from "./infrastructure/db.js";
import dotenv from "dotenv";
import reviewRouter from "./api/review.js";
import userRouter from "./api/user.js";
import bookingRouter from "./api/booking.js";
import locationRouter from "./api/location.js";
import cors from "cors";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware.js";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();

// convert http payload into java objects
app.use(express.json()); /// middleware
app.use(
  cors({
    origin: "http://localhost:5173", // middleware
  })
);

app.use(clerkMiddleware()); // reads thw JWT token from the request and sets the auth object on the request
app.use("/api/hotels", hotelRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/users", userRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/location", locationRouter);

app.use(globalErrorHandlingMiddleware);

//connect Db
connectDb();

const PORT = 8000;

app.listen(PORT, () => {
  console.log("Sever is running on port " + PORT);
});
