import Review from "../infrastructure/entities/Review.js";
import Hotel from "../infrastructure/entities/Hotel.js";

export const createReview = async (req, res) => {
  try {
    const reviewData = req.body;
    if (!reviewData.rating || !reviewData.comment || !reviewData.hotelId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hotel = await Hotel.findById(reviewData.hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const review = await Review.create({
      rating: reviewData.rating,
      comment: reviewData.comment,
    });
    hotel.review.push(review._id);
    await hotel.save();

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating review", error: error.message });
  }
};

export const getReviewForHotel = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId).populate("review");
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel.review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};
