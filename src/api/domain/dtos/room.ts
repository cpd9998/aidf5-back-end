import { z } from "zod";

const STATUS_OPTIONS = [
  "Available",
  "Occupied",
  "Maintenance",
  "Cleaning",
] as const;

const CreateRoomDto = z.object({
  roomNumber: z.string().trim().min(1, "Room number cannot be empty"),
  hotelId: z.string().min(1, "Hotel  is required"),
  categoryId: z.string().min(1, "Hotelmcategory  is required"),
  floor: z
    .number()
    .int("Floor must be a whole number") // Floors are typically integers
    .min(1, "Floor must be 1 or higher"),
});

export { CreateRoomDto };
