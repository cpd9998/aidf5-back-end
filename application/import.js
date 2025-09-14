import Hotel from "../infrastructure/entities/Hotel.js";
import Review from "../infrastructure/entities/Review.js";
import  {hotels} from "../util/hotel-list.js"

export const importHotel = async (req, res) => {
    try {
        console.log("hotels",hotels)
         for(let hotel of hotels){
             const newHotelList = new Hotel(hotel)
             await newHotelList.save();
         }
        res.status(201).json({ message: "Hotel list  created successfully", newHotelList });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error creating review", error: error.message });
    }
};