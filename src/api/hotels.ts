import express from "express";
import {
  getAllHotels,
  createHotel,
  getHotelById,
  updateHotel,
  patchHotel,
  deleteHotel,
  seedHotelsWithEmbedding,
} from "../application/hotel";
import isAuthenticated from "./middleware/authentication-middleware";
import isAdmin from "./middleware/authorization-middleware";
import { respondToAIQuery } from "../application/ai";
import {
  createRoomCategory,
  deleteRoomCategory,
  getAllRoomCategories,
  getRoomCategorylById,
  patchRoomCategory,
  updateRoomCategory,
} from "../application/room-category";
import {
  createRoom,
  deleteRoom,
  getAllRoom,
  getRoomlById,
  patchRoomStatus,
  updateRoom,
} from "../application/room";
import multer from "multer";
import { getHotelBySearch } from "../application/hotel";

// Multer setup (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const hotelRouter = express.Router();

hotelRouter.route("/seed").get(seedHotelsWithEmbedding);

hotelRouter.route("/").get(getAllHotels);
hotelRouter.route("/").post(upload.single("image"), createHotel);

hotelRouter.route("/search").get(getHotelBySearch);

hotelRouter
  .route("/room-category")
  .post(upload.array("images"), createRoomCategory)
  .get(getAllRoomCategories);

hotelRouter
  .route("/room-category/:id")
  .get(getRoomCategorylById)
  .put(upload.array("images", 5), updateRoomCategory)
  .patch(patchRoomCategory)
  .delete(deleteRoomCategory);

hotelRouter.route("/room").post(createRoom).get(getAllRoom);

hotelRouter
  .route("/room/:id")
  .get(getRoomlById)
  .put(updateRoom)
  .patch(patchRoomStatus)
  .delete(deleteRoom);

hotelRouter
  .route("/:id")
  .get(isAuthenticated, getHotelById)
  .put(upload.single("image"), updateHotel)
  .patch(patchHotel)
  .delete(deleteHotel);

hotelRouter.route("/ai").post(respondToAIQuery);

// Example search route

export default hotelRouter;
