import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    hotelId: {
      // Assuming hotelId is a MongoDB ObjectId reference
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomCategory",
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance", "Cleaning"],
      default: "Available",
      required: true,
    },

    floor: {
      type: Number,
      min: 1,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

RoomSchema.index(
  { roomNumber: 1, hotelId: 1, categoryId: 1 },
  { unique: true }
);

export const Room = mongoose.model("Room", RoomSchema);
