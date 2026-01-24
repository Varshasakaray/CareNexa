import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
    basePrice: { 
        type: Number, 
        default: 200,
        required: true
    },
    earlyMorningCharge: { 
        type: Number, 
        default: 50,
        required: true
    },
    nightCharge: { 
        type: Number, 
        default: 100,
        required: true
    },
    emergencyCharge: { 
        type: Number, 
        default: 0,
        required: true
    },
    registrationFee: {
        type: Number,
        default: 10,
        required: true
    },
    // Future: region-based pricing
    region: {
        type: String,
        default: 'default'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

// Ensure only one pricing document exists
pricingSchema.statics.getCurrentPricing = async function() {
    let pricing = await this.findOne();
    if (!pricing) {
        pricing = await this.create({});
    }
    return pricing;
};

export const Pricing = mongoose.model("Pricing", pricingSchema);
