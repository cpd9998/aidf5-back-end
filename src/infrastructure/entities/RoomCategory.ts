import mongoose from "mongoose";

const RoomCategorySchema = new mongoose.Schema(
  {
    hotelId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Hotel",
    },

    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    maxAdults: {
      type: Number,
      required: true,
      max: 2,
    },

    maxChildren: {
      type: Number,
      default: 0,
      min: 0,
    },

    amenities: {
      type: [String],
      default: [],
      require: true,
    },

    images: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export const RoomCategory = mongoose.model("RoomCategory", RoomCategorySchema);
