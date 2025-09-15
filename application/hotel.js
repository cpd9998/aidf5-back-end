import Hotel from "../infrastructure/entities/Hotel.js";

export const getAllHotels = async (req, res,next) => {
  try {
    const hotels = await Hotel.find();
    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: "No hotels found" });
    }

    res.status(200).json(hotels);

  } catch (error) {
      next(error);
  }
};

export const createHotel = async (req, res,next) => {
  try {
    const hotelData = req.body;
    if (
      !hotelData.name ||
      !hotelData.location ||
      !hotelData.price ||
      !hotelData.description
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newHotel = new Hotel(hotelData);
    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
      next(error);
  }
};

export const getHotelById = async (req, res,next) => {
  try {
    const _id = req.params.id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(hotel);
  } catch (error) {
      next(error);
  }
};

export const updateHotel = async (req, res,next) => {
  try {
    const _id = req.params.id;
    if (
      !req.body.name ||
      !req.body.location ||
      !req.body.price ||
      !req.body.description
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const hotel = await Hotel.findByIdAndUpdate(_id, req.body, { new: true });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(hotel);
  } catch (error) {
      next(error);
  }
};

export const patchHotel = async (req, res,next) => {
  try {
    const _id = req.params.id;
    const updateData = req.body;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    await Hotel.findByIdAndUpdate(_id, { price: updateData.price });
    res.status(200).json({ message: "Hotel price updated successfully" });
  } catch (error) {
      next(error);
  }
};

export const deleteHotel = async (req, res,next) => {
  try {
    const _id = req.params.id;
    const hotel = await Hotel.findByIdAndDelete(_id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
      next(error);
  }
};
