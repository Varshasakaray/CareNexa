import { Booking } from "../models/bookingModel.js";
import { Helper } from "../models/helperModel.js";
import { User } from "../models/userModel.js";
import { Rating } from "../models/ratingModel.js";
import { Transaction } from "../models/transactionModel.js";
import mongoose from "mongoose";
import { calculateBookingPrice } from "../utils/calculatePrice.js";
import { generateOTP, getOTPExpiry } from "../utils/generateOTP.js";
import {
  sendBookingNotificationToHelper,
  sendBookingOTPToPatient,
} from "../emailVerify/helperEmails.js";

/**
 * Browse Available Helpers (by pincode)
 */
export const browseHelpers = async (req, res) => {
  try {
    const { pincode } = req.query;

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required",
      });
    }

    const helpers = await Helper.find({
      pincode,
      isActive: true,
      isAvailable: true,
      verificationStatus: "approved",
    }).select(
      "-password -aadhaarNumber -governmentIdProof -emergencyContact -token",
    );

    return res.status(200).json({
      success: true,
      count: helpers.length,
      data: helpers.map((helper) => ({
        _id: helper._id,
        fullName: helper.fullName,
        profilePhoto: helper.profilePhoto,
        averageRating: helper.averageRating,
        totalRatings: helper.totalRatings,
        completedDuties: helper.completedDuties,
        experienceLevel: helper.experienceLevel,
        trustBadge: helper.trustBadge,
        pincode: helper.pincode,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Helper Details
 */
export const getHelperDetails = async (req, res) => {
  try {
    const { helperId } = req.params;

    const helper = await Helper.findById(helperId).select(
      "-password -aadhaarNumber -governmentIdProof -emergencyContact -token",
    );

    if (
      !helper ||
      !helper.isActive ||
      helper.verificationStatus !== "approved"
    ) {
      return res.status(404).json({
        success: false,
        message: "Helper not found or not available",
      });
    }

    return res.status(200).json({
      success: true,
      data: helper,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Calculate Booking Price
 */
export const calculatePrice = async (req, res) => {
  try {
    const { appointmentTime, isEmergency } = req.body;

    if (!appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Appointment time is required",
      });
    }

    const appointmentDate = new Date(appointmentTime);
    const now = new Date();

    // Check minimum 15 minutes prior booking
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    if (minutesDiff < 15 && minutesDiff > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Booking must be done at least 15 minutes prior to appointment time",
      });
    }

    const priceDetails = await calculateBookingPrice(
      appointmentDate,
      isEmergency || false,
    );

    return res.status(200).json({
      success: true,
      data: priceDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create Booking
 */
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.userId;
    const {
      helperId,
      patientAddress,
      hospitalName,
      appointmentTime,
      isEmergency,
      paymentDetails, // New field for payment
    } = req.body;

    if (!helperId || !patientAddress || !appointmentTime || !paymentDetails) {
      return res.status(400).json({
        success: false,
        message: "All required fields (including payment) are missing",
      });
    }

    // Validate appointment time (minimum 15 minutes prior)
    const appointmentDate = new Date(appointmentTime);
    const now = new Date();
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    if (minutesDiff < 15 && minutesDiff > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Booking must be done at least 15 minutes prior to appointment time",
      });
    }

    if (minutesDiff < 0) {
      return res.status(400).json({
        success: false,
        message: "Appointment time cannot be in the past",
      });
    }

    // [ACID: Isolation] Check helper availability within transaction
    const helper = await Helper.findById(helperId).session(session);
    if (!helper || !helper.isActive || !helper.isAvailable) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Helper is not available for booking",
      });
    }

    // [ACID: Isolation] Check if helper is already booked for this slot
    const existingBooking = await Booking.findOne({
      helperId,
      status: { $in: ["pending", "accepted", "otp_sent", "otp_verified"] },
      appointmentTime: { $gte: now },
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Helper is already booked for this time slot",
      });
    }

    // Calculate price
    const priceDetails = await calculateBookingPrice(
      appointmentDate,
      isEmergency || false,
    );

    // Set helper response deadline (10 minutes)
    const responseDeadline = new Date(Date.now() + 10 * 60 * 1000);

    // [ACID: Atomicity] 1. Create booking (Pending status)
    const [booking] = await Booking.create(
      [
        {
          userId,
          helperId,
          patientAddress,
          hospitalName,
          appointmentTime: appointmentDate,
          basePrice: priceDetails.basePrice,
          earlyMorningCharge: priceDetails.earlyMorningCharge,
          nightCharge: priceDetails.nightCharge,
          emergencyCharge: priceDetails.emergencyCharge,
          totalPrice: priceDetails.totalPrice,
          status: "pending",
          helperResponseDeadline: responseDeadline,
          paymentStatus: "pending", // Will update after simulation
        },
      ],
      { session },
    );

    // [ACID: Atomicity] 2. Simulate Payment Gateway call from scratch
    // In a real scenario, this would be an external API call.
    // For ACID, we MUST ensure this succeed before committing.
    const transactionId = `TXN_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)
      .toUpperCase()}`;

    // Simple validation simulation
    const { cardNumber } = paymentDetails;
    if (cardNumber === "0000000000000000") {
      // Simulate failed card for testing ACID rollback
      throw new Error("Payment declined by bank");
    }

    // [ACID: Atomicity] 3. Create Transaction record
    await Transaction.create(
      [
        {
          bookingId: booking._id,
          userId,
          amount: priceDetails.totalPrice,
          status: "success",
          transactionId,
          cardLast4: cardNumber.slice(-4),
        },
      ],
      { session },
    );

    // [ACID: Consistency] 4. Update Booking and Helper states
    booking.paymentStatus = "completed";
    booking.paymentTransactionId = transactionId;
    await booking.save({ session });

    helper.isAvailable = false;
    await helper.save({ session });

    // Update total bookings count for user and helper
    const user = await User.findById(userId).session(session);
    if (user) {
      user.totalBookings = (user.totalBookings || 0) + 1;
      await user.save({ session });
    }
    helper.totalBookings = (helper.totalBookings || 0) + 1;
    await helper.save({ session });

    // Commit all changes
    await session.commitTransaction();
    session.endSession();

    // After commit, send notification (Async-ish)
    sendBookingNotificationToHelper(helper.email, helper.fullName, {
      patientAddress,
      hospitalName,
      appointmentTime: appointmentDate,
      totalPrice: priceDetails.totalPrice,
    }).catch((err) => console.log("Notification error:", err));

    return res.status(201).json({
      success: true,
      message: "Payment successful and booking created.",
      data: {
        booking,
        transactionId,
      },
    });
  } catch (error) {
    // [ACID: Durability/Consistency] Abort rollbacks all changes in session
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred during booking",
    });
  }
};

/**
 * Accept Booking (Helper)
 */
export const acceptBooking = async (req, res) => {
  try {
    const helperId = req.userId;
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.helperId.toString() !== helperId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be accepted. Current status: ${booking.status}`,
      });
    }

    // Check if deadline passed
    if (new Date() > booking.helperResponseDeadline) {
      booking.status = "auto_failed";
      await booking.save();
      return res.status(400).json({
        success: false,
        message: "Response deadline has passed. Booking auto-failed.",
      });
    }

    // Generate OTP for patient verification
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry(10);

    booking.status = "otp_sent";
    booking.bookingOTP = otp;
    booking.otpExpiry = otpExpiry;
    await booking.save();

    // Send OTP to patient (User)
    const user = await User.findById(booking.userId);
    if (!user) {
      console.log(`User not found for booking: ${bookingId}`);
      return res.status(404).json({
        success: false,
        message: "Patient user not found. Could not send OTP.",
      });
    }

    console.log(`Attempting to send OTP to patient email: ${user.email}`);
    const emailSent = await sendBookingOTPToPatient(
      user.email,
      user.username,
      otp,
    );
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to send OTP email to patient. Please check email configuration.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking accepted. Verification OTP sent to patient.",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Reject Booking (Helper)
 */
export const rejectBooking = async (req, res) => {
  try {
    const helperId = req.userId;
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.helperId.toString() !== helperId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be rejected. Current status: ${booking.status}`,
      });
    }

    booking.status = "rejected";
    await booking.save();

    // Set helper back to available
    const helper = await Helper.findById(helperId);
    helper.isAvailable = true;
    await helper.save();

    // Update cancelled bookings count for user and helper
    const user = await User.findById(userId);
    if (user) {
      user.cancelledBookings = (user.cancelledBookings || 0) + 1;
      await user.save();
    }
    helper.cancelledBookings = (helper.cancelledBookings || 0) + 1;
    await helper.save();

    return res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Verify Booking OTP (Helper) - OTP sent to patient, verified by helper
 */
export const verifyBookingOTP = async (req, res) => {
  try {
    const helperId = req.userId;
    const { bookingId } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.helperId.toString() !== helperId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (booking.status !== "otp_sent") {
      return res.status(400).json({
        success: false,
        message: `OTP verification not allowed. Current status: ${booking.status}`,
      });
    }

    if (!booking.bookingOTP || !booking.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated for this booking",
      });
    }

    if (new Date() > booking.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (booking.bookingOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Verify OTP (helper verifies the OTP that patient received)
    booking.status = "otp_verified";
    booking.otpVerified = true;
    booking.otpVerifiedAt = new Date();
    booking.dutyStartedAt = new Date();
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Duty started.",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Complete Duty (Helper)
 */
export const completeDuty = async (req, res) => {
  try {
    const helperId = req.userId;
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.helperId.toString() !== helperId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (booking.status !== "otp_verified") {
      return res.status(400).json({
        success: false,
        message: `Duty cannot be completed. Current status: ${booking.status}`,
      });
    }

    booking.status = "duty_completed";
    booking.dutyCompletedAt = new Date();
    booking.paymentStatus = "completed";
    await booking.save();

    // Update helper stats
    const helper = await Helper.findById(helperId);
    helper.completedDuties += 1;
    helper.isAvailable = true; // Set back to available
    await helper.save();

    // Update user stats
    const user = await User.findById(booking.userId);
    if (user) {
      user.completedBookings = (user.completedBookings || 0) + 1;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message:
        "Duty completed successfully. Patient can now rate your service.",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Cancel Booking (Patient/User)
 */
export const cancelBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (["cancelled", "duty_completed", "rejected"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled. Current status: ${booking.status}`,
      });
    }

    // Check if within 10 minutes (free cancellation)
    const bookingTime = new Date(booking.createdAt);
    const now = new Date();
    const minutesDiff = (now - bookingTime) / (1000 * 60);
    const isFreeCancellation = minutesDiff <= 10;

    booking.status = "cancelled";
    booking.cancelledAt = now;
    booking.cancellationReason = reason || null;
    booking.isFreeCancellation = isFreeCancellation;
    booking.paymentStatus = isFreeCancellation ? "refunded" : "pending";
    await booking.save();

    // Set helper back to available
    const helper = await Helper.findById(booking.helperId);
    helper.isAvailable = true;
    await helper.save();

    return res.status(200).json({
      success: true,
      message: isFreeCancellation
        ? "Booking cancelled successfully. Full refund will be processed."
        : "Booking cancelled successfully.",
      isFreeCancellation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Rate Helper (Patient/User)
 */
export const rateHelper = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (booking.status !== "duty_completed") {
      return res.status(400).json({
        success: false,
        message: "Can only rate completed duties",
      });
    }

    if (booking.rating) {
      return res.status(400).json({
        success: false,
        message: "Booking already rated",
      });
    }

    // Update booking rating
    booking.rating = rating;
    booking.feedback = feedback || null;
    booking.ratedAt = new Date();
    await booking.save();

    // Create rating record
    await Rating.create({
      bookingId,
      helperId: booking.helperId,
      userId,
      rating,
      feedback: feedback || null,
    });

    // Update helper average rating
    const helper = await Helper.findById(booking.helperId);
    const allRatings = await Rating.find({ helperId: helper._id });
    const totalRatings = allRatings.length;
    const sumRatings = allRatings.reduce((sum, r) => sum + r.rating, 0);
    helper.averageRating =
      totalRatings > 0 ? (sumRatings / totalRatings).toFixed(2) : 0;
    helper.totalRatings = totalRatings;

    // Update experience level based on completed duties
    if (helper.completedDuties >= 100) {
      helper.experienceLevel = "expert";
    } else if (helper.completedDuties >= 50) {
      helper.experienceLevel = "experienced";
    } else if (helper.completedDuties >= 20) {
      helper.experienceLevel = "intermediate";
    }

    // Trust badge (4.5+ rating and 20+ duties)
    if (helper.averageRating >= 4.5 && helper.completedDuties >= 20) {
      helper.trustBadge = true;
    }

    await helper.save();

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      data: {
        rating,
        feedback: feedback || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Booking History (Patient/User)
 */
export const getBookingHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({ userId })
      .populate("helperId", "fullName profilePhoto averageRating")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Helper Bookings
 */
export const getHelperBookings = async (req, res) => {
  try {
    const helperId = req.userId;

    const bookings = await Booking.find({ helperId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
