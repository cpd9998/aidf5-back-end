import Location from "../infrastructure/entities/Location.js";
import Hotel from "../infrastructure/entities/Hotel.js";
import  {ValidationError,NotFoundError,UnauthorizedError} from '../api/domain/errors/index.js'


export const getAllLocations = async (req, res,next) => {
    try {
        const locations = await Location.find();
        if (!locations || locations.length === 0) {
           throw new NotFoundError("No locations found")
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
           throw new ValidationError("Missing required fields")
        }
        const newLocation = new Location(locationData);
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (error) {
        next(error);
    }
};
