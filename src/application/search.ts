import { Request, Response, NextFunction } from "express";
import { ValidationError, NotFoundError } from "../api/domain/errors/index";
import { embed } from "../util/embedding";
import Hotel from "../infrastructure/entities/Hotel";
import { SearchHotelsDto } from "../api/domain/dtos/hotel";

export const getHotelsBySearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("getHotelsBySearch called");
    const result = SearchHotelsDto.safeParse(req.query);
    if (!result.success) {
      throw new ValidationError(`${result.error.message}`);
    }

    const { query } = result.data;
    const queryEmbedding = await embed(query);
    const hotels = await Hotel.aggregate([
      {
        $vectorSearch: {
          index: "ai_hotels_vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 4,
        },
      },
      {
        $project: {
          _id: 1,
          review: 1,
          rating: 1,
          name: 1,
          city: 1,
          country: 1,
          price: 1,
          desc: 1,
          image: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },

      // Sort by score descending
      {
        $sort: { score: -1 },
      },
      // Limit final results
      {
        $limit: 4,
      },
    ]);

    // Log the scores for debugging
    console.log("Search results:", hotels);

    res.status(200).json(hotels);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
