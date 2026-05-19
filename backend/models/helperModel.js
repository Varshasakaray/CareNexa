import mongoose from "mongoose";

const helperSchema = new mongoose.Schema({
    // Basic Information
    fullName: { type: String, required: true },
    age: { 
        type: Number, 
        required: true,
        min: 18,
        max: 45,
        validate: {
            validator: function(v) {
                return v >= 18 && v <= 45;
            },
            message: 'Age must be between 18 and 45 years'
        }
    },
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    
    // Aadhaar (masked & encrypted)
    aadhaarNumber: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhaar must be 12 digits'
        }
    },
    aadhaarLast4: { type: String, required: true }, // Last 4 digits for display
    
    // Address
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    
    // Files
    profilePhoto: { type: String, default: null }, // Path to uploaded file
    governmentIdProof: { type: String, default: null }, // Path to uploaded file
    
    // Emergency Contact
    emergencyContact: {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        relation: { type: String, required: true }
    },
    
    // Account & Verification
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false }, // Admin approved
    isAvailable: { type: Boolean, default: false }, // Currently available for booking
    verificationStatus: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'resubmission_required'],
        default: 'pending'
    },
    rejectionReason: { type: String, default: null },
    helperRegistrationNumber: { type: String, unique: true, sparse: true },
    
    // Payment
    registrationPaid: { type: Boolean, default: false },
    paymentTransactionId: { type: String, default: null },
    
    // Stats
    totalBookings: { type: Number, default: 0 },
    completedDuties: { type: Number, default: 0 },
    cancelledBookings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    
    // Trust & Experience
    trustBadge: { type: Boolean, default: false },
    experienceLevel: { 
        type: String, 
        enum: ['beginner', 'intermediate', 'experienced', 'expert'],
        default: 'beginner'
    },
    
    // Session
    isLoggedIn: { type: Boolean, default: false },
    token: { type: String, default: null },
    loginOTP: { type: String, default: null },
    loginOTPExpiry: { type: Date, default: null },
    
    // Timestamps
    verifiedAt: { type: Date, default: null },
    lastActiveAt: { type: Date, default: null }
}, { timestamps: true });

// Index for efficient queries
helperSchema.index({ pincode: 1, isActive: 1, isAvailable: 1 });
// Note: aadhaarNumber index is already created by unique: true in schema

export const Helper = mongoose.model("Helper", helperSchema);
