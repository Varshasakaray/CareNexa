import { Helper } from '../models/helperModel.js';
import { Patient } from '../models/patientModel.js';
import { Booking } from '../models/bookingModel.js';
import { Pricing } from '../models/pricingModel.js';
import { Rating } from '../models/ratingModel.js';
import { generateHelperRegistrationNumber } from '../utils/generateHelperId.js';
import { sendHelperApprovalEmail, sendHelperRejectionEmail } from '../emailVerify/helperEmails.js';

/**
 * Get All Pending Helpers
 */
export const getPendingHelpers = async (req, res) => {
    try {
        const helpers = await Helper.find({
            verificationStatus: 'pending',
            registrationPaid: true
        }).select('-password -aadhaarNumber');

        return res.status(200).json({
            success: true,
            count: helpers.length,
            data: helpers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get All Helpers
 */
export const getAllHelpers = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) {
            query.verificationStatus = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const helpers = await Helper.find(query)
            .select('-password -aadhaarNumber')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Helper.countDocuments(query);

        return res.status(200).json({
            success: true,
            count: helpers.length,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            data: helpers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Helper Details (Admin View)
 */
export const getHelperDetailsAdmin = async (req, res) => {
    try {
        const { helperId } = req.params;

        const helper = await Helper.findById(helperId).select('-password');
        if (!helper) {
            return res.status(404).json({
                success: false,
                message: 'Helper not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: helper
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Approve Helper
 */
export const approveHelper = async (req, res) => {
    try {
        const { helperId } = req.params;

        const helper = await Helper.findById(helperId);
        if (!helper) {
            return res.status(404).json({
                success: false,
                message: 'Helper not found'
            });
        }

        if (helper.verificationStatus === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Helper already approved'
            });
        }

        // Generate unique registration number
        const registrationNumber = await generateHelperRegistrationNumber(Helper);

        helper.verificationStatus = 'approved';
        helper.isActive = true;
        helper.helperRegistrationNumber = registrationNumber;
        helper.verifiedAt = new Date();
        await helper.save();

        // Send approval email
        await sendHelperApprovalEmail(helper.email, helper.fullName, registrationNumber);

        return res.status(200).json({
            success: true,
            message: 'Helper approved successfully',
            data: {
                helperId: helper._id,
                registrationNumber,
                fullName: helper.fullName
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Reject Helper
 */
export const rejectHelper = async (req, res) => {
    try {
        const { helperId } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required'
            });
        }

        const helper = await Helper.findById(helperId);
        if (!helper) {
            return res.status(404).json({
                success: false,
                message: 'Helper not found'
            });
        }

        if (helper.verificationStatus === 'rejected') {
            return res.status(400).json({
                success: false,
                message: 'Helper already rejected'
            });
        }

        helper.verificationStatus = 'rejected';
        helper.rejectionReason = reason;
        helper.isActive = false;
        await helper.save();

        // Send rejection email
        await sendHelperRejectionEmail(helper.email, helper.fullName, reason);

        return res.status(200).json({
            success: true,
            message: 'Helper rejected successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Request Re-submission
 */
export const requestResubmission = async (req, res) => {
    try {
        const { helperId } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Reason for re-submission is required'
            });
        }

        const helper = await Helper.findById(helperId);
        if (!helper) {
            return res.status(404).json({
                success: false,
                message: 'Helper not found'
            });
        }

        helper.verificationStatus = 'resubmission_required';
        helper.rejectionReason = reason;
        await helper.save();

        return res.status(200).json({
            success: true,
            message: 'Re-submission requested successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Suspend Helper
 */
export const suspendHelper = async (req, res) => {
    try {
        const { helperId } = req.params;
        const { reason } = req.body;

        const helper = await Helper.findById(helperId);
        if (!helper) {
            return res.status(404).json({
                success: false,
                message: 'Helper not found'
            });
        }

        helper.isActive = false;
        helper.isAvailable = false;
        if (reason) {
            helper.rejectionReason = reason;
        }
        await helper.save();

        return res.status(200).json({
            success: true,
            message: 'Helper suspended successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get All Patients
 */
export const getAllPatients = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const patients = await Patient.find()
            .select('-password')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Patient.countDocuments();

        return res.status(200).json({
            success: true,
            count: patients.length,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            data: patients
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get All Bookings
 */
export const getAllBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const bookings = await Booking.find(query)
            .populate('patientId', 'fullName email mobileNumber')
            .populate('helperId', 'fullName email mobileNumber helperRegistrationNumber')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Booking.countDocuments(query);

        return res.status(200).json({
            success: true,
            count: bookings.length,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            data: bookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Booking Statistics
 */
export const getBookingStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalBookings = await Booking.countDocuments();
        const todayBookings = await Booking.countDocuments({
            createdAt: { $gte: today }
        });
        const completedBookings = await Booking.countDocuments({ status: 'duty_completed' });
        const activeBookings = await Booking.countDocuments({
            status: { $in: ['pending', 'accepted', 'otp_sent', 'otp_verified'] }
        });

        // Revenue calculation
        const revenueData = await Booking.aggregate([
            {
                $match: { paymentStatus: 'completed' }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' },
                    todayRevenue: {
                        $sum: {
                            $cond: [
                                { $gte: ['$createdAt', today] },
                                '$totalPrice',
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;
        const todayRevenue = revenueData[0]?.todayRevenue || 0;

        // Active helpers count
        const activeHelpers = await Helper.countDocuments({
            isActive: true,
            isAvailable: true
        });

        // Total helpers
        const totalHelpers = await Helper.countDocuments({ isActive: true });

        return res.status(200).json({
            success: true,
            data: {
                bookings: {
                    total: totalBookings,
                    today: todayBookings,
                    completed: completedBookings,
                    active: activeBookings
                },
                revenue: {
                    total: totalRevenue,
                    today: todayRevenue
                },
                helpers: {
                    total: totalHelpers,
                    active: activeHelpers
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Helper Ratings Report
 */
export const getHelperRatingsReport = async (req, res) => {
    try {
        const { minRating = 0 } = req.query;

        const helpers = await Helper.find({
            isActive: true,
            averageRating: { $gte: parseFloat(minRating) }
        })
            .select('fullName helperRegistrationNumber averageRating totalRatings completedDuties trustBadge')
            .sort({ averageRating: -1 });

        // Flag low-rated helpers
        const lowRatedHelpers = helpers.filter(h => h.averageRating < 3.0 && h.totalRatings >= 5);

        return res.status(200).json({
            success: true,
            count: helpers.length,
            lowRatedCount: lowRatedHelpers.length,
            data: helpers,
            lowRatedHelpers: lowRatedHelpers.map(h => ({
                _id: h._id,
                fullName: h.fullName,
                registrationNumber: h.helperRegistrationNumber,
                averageRating: h.averageRating,
                totalRatings: h.totalRatings
            }))
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Current Pricing
 */
export const getCurrentPricing = async (req, res) => {
    try {
        const pricing = await Pricing.getCurrentPricing();

        return res.status(200).json({
            success: true,
            data: pricing
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Update Pricing
 */
export const updatePricing = async (req, res) => {
    try {
        const { basePrice, earlyMorningCharge, nightCharge, emergencyCharge, registrationFee } = req.body;
        const adminId = req.userId;

        const pricing = await Pricing.getCurrentPricing();

        if (basePrice !== undefined) pricing.basePrice = basePrice;
        if (earlyMorningCharge !== undefined) pricing.earlyMorningCharge = earlyMorningCharge;
        if (nightCharge !== undefined) pricing.nightCharge = nightCharge;
        if (emergencyCharge !== undefined) pricing.emergencyCharge = emergencyCharge;
        if (registrationFee !== undefined) pricing.registrationFee = registrationFee;

        pricing.updatedBy = adminId;
        await pricing.save();

        return res.status(200).json({
            success: true,
            message: 'Pricing updated successfully',
            data: pricing
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
