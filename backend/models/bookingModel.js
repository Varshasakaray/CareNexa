import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // References
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Helper",
      required: true,
    },

    // Booking Details
    patientAddress: { type: String, required: true },
    hospitalName: { type: String, required: true },
    appointmentTime: { type: Date, required: true },
    bookingTime: { type: Date, default: Date.now },

    // Status
    status: {
      type: String,
      enum: [
        "pending", // Waiting for helper response
        "accepted", // Helper accepted
        "rejected", // Helper rejected
        "otp_sent", // OTP sent to patient
        "otp_verified", // OTP verified, duty started
        "duty_completed", // Helper marked duty complete
        "cancelled", // Cancelled by patient
        "auto_failed", // No response from helper
      ],
      default: "pending",
    },

    // Pricing
    basePrice: { type: Number, default: 200 },
    earlyMorningCharge: { type: Number, default: 0 }, // +₹50
    nightCharge: { type: Number, default: 0 }, // +₹100
    emergencyCharge: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    // OTP
    bookingOTP: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    otpVerified: { type: Boolean, default: false },
    otpVerifiedAt: { type: Date, default: null },

    // Timing
    helperResponseDeadline: { type: Date, default: null }, // X minutes after booking
    dutyStartedAt: { type: Date, default: null },
    dutyCompletedAt: { type: Date, default: null },

    // Cancellation
    cancelledAt: { type: Date, default: null },
    cancellationReason: { type: String, default: null },
    isFreeCancellation: { type: Boolean, default: false }, // Within 10 minutes

    // Payment
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
    paymentTransactionId: { type: String, default: null },

    // Rating
    rating: { type: Number, default: null, min: 1, max: 5 },
    feedback: { type: String, default: null },
    ratedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Indexes
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ helperId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ appointmentTime: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
