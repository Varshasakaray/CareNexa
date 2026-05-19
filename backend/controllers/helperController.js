import { Helper } from "../models/helperModel.js";
import { Pricing } from "../models/pricingModel.js";
import { Transaction } from "../models/transactionModel.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAadhaarLast4 } from "../utils/aadhaarMask.js";
import { verifyMail } from "../emailVerify/verifyMail.js";
import {
  sendHelperApprovalEmail,
  sendHelperRejectionEmail,
  sendBookingNotificationToHelper,
  sendDutyCompletionReminder,
  sendHelperLoginOTP as sendHelperLoginOTPEmail,
} from "../emailVerify/helperEmails.js";
import { generateOTP, getOTPExpiry } from "../utils/generateOTP.js";
import { Session } from "../models/sessionModel.js";

/**
 * Helper Registration
 */
export const registerHelper = async (req, res) => {
  try {
    const {
      fullName,
      age,
      mobileNumber,
      email,
      aadhaarNumber,
      address,
      pincode,
      emergencyContact,
      password,
    } = req.body;

    // Validation
    if (
      !fullName ||
      !age ||
      !mobileNumber ||
      !email ||
      !aadhaarNumber ||
      !address ||
      !pincode ||
      !emergencyContact ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Age validation
    if (age < 18 || age > 45) {
      return res.status(400).json({
        success: false,
        message: "Age must be between 18 and 45 years",
      });
    }

    // Check if Aadhaar already exists
    const existingAadhaar = await Helper.findOne({ aadhaarNumber });
    if (existingAadhaar) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number already registered",
      });
    }

    // Check if email/mobile already exists
    const existingHelper = await Helper.findOne({
      $or: [{ email }, { mobileNumber }],
    });
    if (existingHelper) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile number already registered",
      });
    }

    // File uploads
    // Store relative path (e.g., uploads/filename.jpg) instead of absolute path
    const profilePhoto = req.files?.profilePhoto?.[0]?.filename
      ? `uploads/${req.files.profilePhoto[0].filename}`
      : null;
    const governmentIdProof = req.files?.governmentIdProof?.[0]?.filename
      ? `uploads/${req.files.governmentIdProof[0].filename}`
      : null;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get Aadhaar last 4 digits
    const aadhaarLast4 = getAadhaarLast4(aadhaarNumber);

    // Create helper (inactive until admin approval)
    const newHelper = await Helper.create({
      fullName,
      age,
      mobileNumber,
      email,
      aadhaarNumber,
      aadhaarLast4,
      address,
      pincode,
      profilePhoto,
      governmentIdProof,
      emergencyContact:
        typeof emergencyContact === "string"
          ? JSON.parse(emergencyContact)
          : emergencyContact,
      password: hashedPassword,
      verificationStatus: "pending",
      isActive: false,
      isAvailable: false,
      registrationPaid: false, // Will be updated after payment
    });

    // Generate verification token
    const token = jwt.sign(
      { id: newHelper._id, type: "helper" },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      },
    );

    // Send verification email
    await verifyMail(token, email);

    newHelper.token = token;
    await newHelper.save();

    // Get registration fee
    const pricing = await Pricing.getCurrentPricing();

    return res.status(201).json({
      success: true,
      message:
        "Helper registered successfully. Please complete payment of ₹" +
        pricing.registrationFee +
        " to proceed.",
      data: {
        helperId: newHelper._id,
        registrationFee: pricing.registrationFee,
        paymentRequired: true,
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
 * Complete Registration Payment
 */
export const completeRegistrationPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { helperId, paymentDetails } = req.body;

    if (!helperId || !paymentDetails) {
      return res.status(400).json({
        success: false,
        message: "Helper ID and payment details are required",
      });
    }

    const helper = await Helper.findById(helperId).session(session);
    if (!helper) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Helper not found",
      });
    }

    if (helper.registrationPaid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Registration payment already completed",
      });
    }

    // Get registration fee
    const pricing = await Pricing.getCurrentPricing();
    const amount = pricing.registrationFee;

    // [ACID: Atomicity] Simulate Payment Gateway call from scratch
    const transactionId = `REG_TXN_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Simple validation simulation (Reuse the same 'declined' card for testing)
    const { cardNumber } = paymentDetails;
    if (cardNumber === "0000000000000000") {
      throw new Error("Payment declined by bank");
    }

    // [ACID: Atomicity] 1. Create Transaction record using specialized model
    await Transaction.create(
      [
        {
          bookingId: helper._id, // Using helperId as reference for original payment
          userId: helper._id, // Helper is the user in this context
          amount: amount,
          status: "success",
          transactionId,
          cardLast4: cardNumber.slice(-4),
        },
      ],
      { session },
    );

    // [ACID: Consistency] 2. Update Helper state
    helper.registrationPaid = true;
    helper.paymentTransactionId = transactionId;
    await helper.save({ session });

    // Commit all changes
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message:
        "Registration payment successful. Waiting for admin verification.",
      data: {
        transactionId,
      },
    });
  } catch (error) {
    // [ACID: Durability/Consistency] Rollback all changes
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred during payment",
    });
  }
};

/**
 * Helper Login - Step 1: Send OTP
 */
export const sendHelperLoginOTP = async (req, res) => {
  try {
    const { helperRegistrationNumber } = req.body;

    if (!helperRegistrationNumber) {
      return res.status(400).json({
        success: false,
        message: "Helper Registration Number is required",
      });
    }

    const helper = await Helper.findOne({ helperRegistrationNumber });
    if (!helper) {
      return res.status(401).json({
        success: false,
        message: "Invalid Helper Registration Number",
      });
    }

    // Check if helper is verified by admin
    if (!helper.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is pending admin verification. Please wait for approval.",
        verificationStatus: helper.verificationStatus,
      });
    }

    // Check if helper email is verified
    if (!helper.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address first.",
      });
    }

    // Check if registration payment is completed
    if (!helper.registrationPaid) {
      return res.status(403).json({
        success: false,
        message: "Please complete registration payment",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry(10);

    helper.loginOTP = otp;
    helper.loginOTPExpiry = otpExpiry;
    await helper.save();

    // Send OTP to registered email
    await sendHelperLoginOTPEmail(helper.email, helper.fullName, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your registered email address",
      helperId: helper._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Helper Login - Step 2: Verify OTP
 */
export const verifyHelperLoginOTP = async (req, res) => {
  try {
    const { helperId, otp } = req.body;

    if (!helperId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Helper ID and OTP are required",
      });
    }

    const helper = await Helper.findById(helperId);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper not found",
      });
    }

    if (!helper.loginOTP || !helper.loginOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated. Please request OTP first.",
      });
    }

    if (new Date() > helper.loginOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (helper.loginOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Clear OTP
    helper.loginOTP = null;
    helper.loginOTPExpiry = null;

    // Clear existing session
    const existingSession = await Session.findOne({ userId: helper._id });
    if (existingSession) {
      await Session.deleteOne({ userId: helper._id });
    }

    // Create new session
    await Session.create({ userId: helper._id });

    // Generate tokens
    const accessToken = jwt.sign({ id: helper._id }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });
    const refreshToken = jwt.sign({ id: helper._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    helper.isLoggedIn = true;
    helper.lastActiveAt = new Date();
    await helper.save();

    // Remove sensitive data
    const helperData = helper.toObject();
    delete helperData.password;
    delete helperData.aadhaarNumber;
    delete helperData.loginOTP;

    return res.status(200).json({
      success: true,
      message: `Welcome back ${helper.fullName}`,
      accessToken,
      refreshToken,
      helper: helperData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Toggle Helper Availability
 */
export const toggleAvailability = async (req, res) => {
  try {
    const helperId = req.userId;
    const { isAvailable } = req.body;

    const helper = await Helper.findById(helperId);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper not found",
      });
    }

    if (!helper.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is not verified yet",
      });
    }

    helper.isAvailable = isAvailable === true;
    await helper.save();

    return res.status(200).json({
      success: true,
      message: `Availability set to ${helper.isAvailable ? "Active" : "Inactive"}`,
      isAvailable: helper.isAvailable,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Helper Profile
 */
export const getHelperProfile = async (req, res) => {
  try {
    const helperId = req.userId;

    const helper = await Helper.findById(helperId).select(
      "-password -aadhaarNumber",
    );
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper not found",
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
 * Update Helper Profile
 */
export const updateHelperProfile = async (req, res) => {
  try {
    const helperId = req.userId;
    const {
      fullName,
      mobileNumber,
      address,
      pincode,
      emergencyContactName,
      emergencyContactMobile,
      emergencyContactRelation,
    } = req.body;

    const helper = await Helper.findById(helperId);
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper not found",
      });
    }

    // Update basic fields
    if (fullName) helper.fullName = fullName;
    if (mobileNumber) helper.mobileNumber = mobileNumber;
    if (address) helper.address = address;
    if (pincode) helper.pincode = pincode;

    // Update emergency contact
    if (
      emergencyContactName ||
      emergencyContactMobile ||
      emergencyContactRelation
    ) {
      helper.emergencyContact = {
        name: emergencyContactName || helper.emergencyContact.name,
        mobile: emergencyContactMobile || helper.emergencyContact.mobile,
        relation: emergencyContactRelation || helper.emergencyContact.relation,
      };
    }

    await helper.save();

    const helperData = helper.toObject();
    delete helperData.password;
    delete helperData.aadhaarNumber;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: helperData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Helper Logout
 */
export const logoutHelper = async (req, res) => {
  try {
    const helperId = req.userId;
    await Session.deleteMany({ userId: helperId });
    await Helper.findByIdAndUpdate(helperId, { isLoggedIn: false });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
