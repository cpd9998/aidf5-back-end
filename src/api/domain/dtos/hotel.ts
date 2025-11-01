import { z } from "zod";

const CreateHotelDto = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  desc: z.string().min(1, "Description is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  image: z.string().url("Image must be a valid URL"),
});

const SearchHotelsDto = z.object({
  query: z.string().min(1, "Query is required"),
});

export { CreateHotelDto, SearchHotelsDto };
