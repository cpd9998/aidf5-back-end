import express from "express";
import hotelRouter from "./src/api/hotels";
import connectDb from "./src/infrastructure/db";
import dotenv from "dotenv";
import reviewRouter from "./src/api/review";
import userRouter from "./src/api/user";
import bookingRouter from "./src/api/booking";
import locationRouter from "./src/api/location";
import cors from "cors";
import globalErrorHandlingMiddleware from "./src/api/middleware/global-error-handling-middleware";
import { clerkMiddleware } from "@clerk/express";
import searchRouter from "./src/api/search";
import paginationRouter from "./src/api/pagination";

dotenv.config();

const app = express();

// convert http payload into java objects
app.use(express.json()); /// middleware
app.use(
  cors({
    origin: "http://localhost:5173", // middleware
  })
);

app.use("/api/ai", searchRouter);

app.use(clerkMiddleware()); // reads thw JWT token from the request and sets the auth object on the request
app.use("/api/hotels", hotelRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/users", userRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/location", locationRouter);
app.use("/api/pagination", paginationRouter);

app.use(globalErrorHandlingMiddleware);

//connect Db
connectDb();

const PORT = 8000;

app.listen(PORT, () => {
  console.log("Sever is running on port " + PORT);
});
