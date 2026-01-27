import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAuthenticatedHelper } from "../middleware/isAuthenticatedHelper.js";
import {
    browseHelpers,
    getHelperDetails,
    calculatePrice,
    createBooking,
    acceptBooking,
    rejectBooking,
    verifyBookingOTP,
    completeDuty,
    cancelBooking,
    rateHelper,
    getBookingHistory,
    getHelperBookings
} from "../controllers/bookingController.js";

const router = express.Router();

// Public routes
router.get('/helpers', browseHelpers);
router.get('/helpers/:helperId', getHelperDetails);
router.post('/calculate-price', calculatePrice);

// Protected routes (Authenticated Users & Patients)
router.post('/create', isAuthenticated, createBooking);
router.post('/:bookingId/cancel', isAuthenticated, cancelBooking);
router.post('/:bookingId/rate', isAuthenticated, rateHelper);
router.get('/history', isAuthenticated, getBookingHistory);

// Protected routes (Helper only)
router.post('/:bookingId/accept', isAuthenticatedHelper, acceptBooking);
router.post('/:bookingId/reject', isAuthenticatedHelper, rejectBooking);
router.post('/:bookingId/verify-otp', isAuthenticatedHelper, verifyBookingOTP); // Helper verifies OTP
router.post('/:bookingId/complete', isAuthenticatedHelper, completeDuty);
router.get('/helper/bookings', isAuthenticatedHelper, getHelperBookings);

export default router;
