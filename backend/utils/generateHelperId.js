/**
 * Generate unique Helper Registration Number
 * Format: HRN-YYYYMMDD-XXXXX (e.g., HRN-20241201-12345)
 */
export const generateHelperRegistrationNumber = async (Helper) => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const helperId = `HRN-${dateStr}-${randomNum}`;
    
    // Check if ID already exists
    const exists = await Helper.findOne({ helperRegistrationNumber: helperId });
    if (exists) {
        // If exists, generate new one recursively
        return generateHelperRegistrationNumber(Helper);
    }
    
    return helperId;
};
