import { Pricing } from '../models/pricingModel.js';

/**
 * Calculate booking price based on time and conditions
 */
export const calculateBookingPrice = async (appointmentTime, isEmergency = false) => {
    const pricing = await Pricing.getCurrentPricing();
    
    let totalPrice = pricing.basePrice;
    
    const hour = new Date(appointmentTime).getHours();
    
    // Early morning (5 AM - 8 AM)
    if (hour >= 5 && hour < 8) {
        totalPrice += pricing.earlyMorningCharge;
    }
    
    // Night (10 PM - 5 AM)
    if (hour >= 22 || hour < 5) {
        totalPrice += pricing.nightCharge;
    }
    
    // Emergency charge
    if (isEmergency) {
        totalPrice += pricing.emergencyCharge;
    }
    
    return {
        basePrice: pricing.basePrice,
        earlyMorningCharge: (hour >= 5 && hour < 8) ? pricing.earlyMorningCharge : 0,
        nightCharge: (hour >= 22 || hour < 5) ? pricing.nightCharge : 0,
        emergencyCharge: isEmergency ? pricing.emergencyCharge : 0,
        totalPrice: totalPrice
    };
};
