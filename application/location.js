import Location from "../infrastructure/entities/Location.js";
import Hotel from "../infrastructure/entities/Hotel.js";



export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        if (!locations || locations.length === 0) {
            return res.status(404).json({ message: "No locations found" });
        }
        res.status(200).json(locations);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return res.status(500).json({ message: "Internal server error" });
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
        console.error("Error creating hotel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
