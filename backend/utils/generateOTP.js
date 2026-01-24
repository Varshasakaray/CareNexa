/**
 * Generate 6-digit OTP
 */
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate OTP expiry time (default 10 minutes)
 */
export const getOTPExpiry = (minutes = 10) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};
