import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    // Basic Information
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Address
    address: { type: String, default: null },
    pincode: { type: String, default: null },
    
    // Account Status
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    token: { type: String, default: null },
    
    // Stats
    totalBookings: { type: Number, default: 0 },
    completedBookings: { type: Number, default: 0 }
}, { timestamps: true });

export const Patient = mongoose.model("Patient", patientSchema);
