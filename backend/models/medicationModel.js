import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true,
        enum: ["once", "twice", "thrice", "four_times", "as_needed"]
    },
    times: [{
        type: String,
        required: true
    }], // Array of times like ["09:00", "21:00"]
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        default: null
    },
    reminderEnabled: {
        type: Boolean,
        default: true
    },
    emailReminder: {
        type: Boolean,
        default: true
    },
    notes: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastReminderSent: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export const Medication = mongoose.model("Medication", medicationSchema);
