import { z } from "zod";

const CreateReviewDto = z.object({
  rating: z.number().min(0, "Rate is required"),
  comment: z.string().min(1, "Comment is required"),
  hotelId: z.string().min(1, "Hotel ID is required"),
});

export { CreateReviewDto };
