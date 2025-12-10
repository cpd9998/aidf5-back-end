import { z } from "zod";

// MongoDB ObjectId validation
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// Guest Details Schema
const guestDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(20),
  idNumber: z.string().optional(),
  address: z.string().optional(),
});

// Payment Status Enum
const paymentStatusSchema = z.enum(["Pending", "Paid", "Refunded", "Failed"]);

// Booking Status Enum
const bookingStatusSchema = z.enum([
  "Confirmed",
  "Cancelled",
  "CheckedIn",
  "CheckedOut",
  "NoShow",
]);

// Full Booking Schema (for database documents)
export const bookingSchema = z.object({
  bookingNumber: z.string().min(1, "Booking number is required"),
  hotelId: objectIdSchema,
  roomId: objectIdSchema,
  categoryId: objectIdSchema,
  guestDetails: guestDetailsSchema,
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
  numberOfAdults: z.number().int().min(1, "At least 1 adult is required"),
  numberOfChildren: z
    .number()
    .int()
    .min(0, "Number of children cannot be negative")
    .default(0),
  totalAmount: z.number().positive("Total amount must be positive"),
  paymentStatus: paymentStatusSchema.default("Pending"),
  bookingStatus: bookingStatusSchema.default("Confirmed"),
  specialRequests: z.string().optional(),
  cancellationReason: z.string().optional(),
  cancelledAt: z.coerce.date().optional(),
  paymentAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Schema for CREATING a new booking (user input)
export const CreateBookingSchemaDto = z
  .object({
    hotelId: objectIdSchema,
    categoryId: objectIdSchema,
    guestDetails: guestDetailsSchema,
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    numberOfAdults: z.number().int().min(1, "At least 1 adult is required"),
    numberOfChildren: z.number().int().min(0).default(0),
    specialRequests: z
      .string()
      .max(500, "Special requests too long")
      .optional(),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  })
  .refine(
    (data) => data.checkInDate >= new Date(new Date().setHours(0, 0, 0, 0)),
    {
      message: "Check-in date cannot be in the past",
      path: ["checkInDate"],
    }
  );

// Schema for UPDATING booking status
export const UpdateBookingStatusSchemaDto = z.object({
  status: bookingStatusSchema,
});

// Schema for UPDATING payment status
export const UpdatePaymentStatusSchemaDto = z.object({
  paymentStatus: paymentStatusSchema,
});

// Schema for CANCELLING a booking
export const CancelBookingSchemaDto = z.object({
  cancellationReason: z
    .string()
    .min(1, "Cancellation reason is required")
    .max(500),
});

// Schema for checking availability
export const checkAvailabilitySchema = z
  .object({
    hotelId: objectIdSchema,
    categoryId: objectIdSchema,
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  })
  .refine(
    (data) => data.checkInDate >= new Date(new Date().setHours(0, 0, 0, 0)),
    {
      message: "Check-in date cannot be in the past",
      path: ["checkInDate"],
    }
  );

// Schema for filtering bookings
export const filterBookingsSchema = z.object({
  status: bookingStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Schema for booking ID parameter
export const bookingIdParamSchema = z.object({
  bookingId: objectIdSchema,
});

// Schema for hotel ID parameter
export const hotelIdParamSchema = z.object({
  hotelId: objectIdSchema,
});

// Type exports for TypeScript
export type Booking = z.infer<typeof bookingSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingSchemaDto>;
export type UpdateBookingStatusInput = z.infer<
  typeof UpdateBookingStatusSchemaDto
>;
export type UpdatePaymentStatusInput = z.infer<
  typeof UpdatePaymentStatusSchemaDto
>;
export type CancelBookingInput = z.infer<typeof CancelBookingSchemaDto>;
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type FilterBookingsInput = z.infer<typeof filterBookingsSchema>;
export type GuestDetails = z.infer<typeof guestDetailsSchema>;
