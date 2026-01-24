/**
 * Mask Aadhaar number - show only last 4 digits
 * @param {string} aadhaar - 12 digit Aadhaar number
 * @returns {string} - Masked Aadhaar (e.g., "XXXX XXXX 1234")
 */
export const maskAadhaar = (aadhaar) => {
    if (!aadhaar || aadhaar.length !== 12) {
        return null;
    }
    const last4 = aadhaar.slice(-4);
    return `XXXX XXXX ${last4}`;
};

/**
 * Get last 4 digits of Aadhaar
 */
export const getAadhaarLast4 = (aadhaar) => {
    if (!aadhaar || aadhaar.length !== 12) {
        return null;
    }
    return aadhaar.slice(-4);
};
