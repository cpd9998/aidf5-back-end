import { z } from "zod";

const CreateRoomCategoryDto = z.object({
  hotelId: z.string().min(1, "Hotel  is required"),
  name: z.string().min(1, "Room Category is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().min(0, "Price must be a positive number"),
  maxAdults: z
    .number()
    .int("Max adults must be a whole number") // Assuming 'maxAdults' should be an integer
    .max(2, "Max adults 2"),
  amenities: z.array(z.string()).min(1, "At lease one amenity required"),
  images: z.array(z.string()).min(1, "At lease one image required"),
});

export { CreateRoomCategoryDto };
