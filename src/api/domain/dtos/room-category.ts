import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MulterFileSchema = z.object({
  path: z.string().min(1, "File path is missing."),
  filename: z.string().min(1, "Filename is missing."),
  mimetype: z
    .string()
    .refine((mimetype) => ACCEPTED_IMAGE_TYPES.includes(mimetype), {
      message: "Invalid file type. Only JPEG, PNG, or WebP are supported.",
    }),
  size: z.number().max(MAX_FILE_SIZE, {
    message: `Image is too large. Max size is ${MAX_FILE_SIZE / 1000000}MB.`,
  }),
});

const ExistingImageSchema = z.string().min(1);

const ImageItemSchema = z.union([
  ExistingImageSchema, // For existing images (strings/URLs)
  MulterFileSchema, // For new uploaded images (Multer file objects)
]);

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
  images: z
    .array(ImageItemSchema)
    .min(1, "At least one image is required.")
    .max(5, "You can upload a maximum of 5 images."),
});

export { CreateRoomCategoryDto };
