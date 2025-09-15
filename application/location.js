import Location from "../infrastructure/entities/Location.js";
import Hotel from "../infrastructure/entities/Hotel.js";



export const getAllLocations = async (req, res,next) => {
    try {
        const locations = await Location.find();
        if (!locations || locations.length === 0) {
            return res.status(404).json({ message: "No locations found" });
        }
        res.status(200).json(locations);
    } catch (error) {
        next(error);

    }
};



export const createLocations = async (req, res) => {
    try {
        const locationData = req.body;
        if (!locationData.name) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const newLocation = new Location(locationData);
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (error) {
        next(error);
    }
};
