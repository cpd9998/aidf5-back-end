import { z } from "zod";

const CreateBookinglDto = z.object({
  userId: z.string().min(1, "User is required"),
  hotelId: z.string().min(1, "Hotel is required"),
  checkIn: z.string().date(),
  checkOut: z.string().date(),
  roomNumber: z.number().min(0, "Room number is required"),
  paymentStatus: z.string().min(1, "Payment status is required"),
});

export { CreateBookinglDto };
