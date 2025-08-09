import express from "express";
import hotelRouter from "./api/hotels.js";
import connectDb from "./infrastructure/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// convert http payload into java objects
app.use(express.json());
app.use("/api/hotels", hotelRouter);

//connect Db
connectDb();

const PORT = 8000;

app.listen(PORT, () => {
  console.log("Sever is running on port " + PORT);
});
