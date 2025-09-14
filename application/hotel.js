import Hotel from "../infrastructure/entities/Hotel.js";

export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: "No hotels found" });
    }
    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createHotel = async (req, res) => {
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
    console.error("Error creating hotel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const _id = req.params.id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateHotel = async (req, res) => {
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
    console.error("Error updating hotel:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const patchHotel = async (req, res) => {
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
    console.error("Error updating hotel:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const _id = req.params.id;
    const hotel = await Hotel.findByIdAndDelete(_id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
