import mongoose from "mongoose";

const healthMetricSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["bloodPressure", "bloodSugar", "weight"]
    },
    systolic: {
        type: Number,
        required: function() {
            return this.type === "bloodPressure";
        }
    },
    diastolic: {
        type: Number,
        required: function() {
            return this.type === "bloodPressure";
        }
    },
    value: {
        type: Number,
        required: function() {
            return this.type === "bloodSugar" || this.type === "weight";
        }
    },
    unit: {
        type: String,
        default: function() {
            if (this.type === "bloodSugar") return "mg/dL";
            if (this.type === "weight") return "kg";
            return null;
        }
    },
    notes: {
        type: String,
        default: ""
    },
    recordedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const HealthMetric = mongoose.model("HealthMetric", healthMetricSchema);
