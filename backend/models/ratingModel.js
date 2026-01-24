import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true
    },
    helperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Helper',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Indexes
ratingSchema.index({ helperId: 1, createdAt: -1 });
ratingSchema.index({ patientId: 1 });

export const Rating = mongoose.model("Rating", ratingSchema);
