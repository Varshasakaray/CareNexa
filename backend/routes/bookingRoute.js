import express from "express";
import { isAuthenticatedPatient } from "../middleware/isAuthenticatedPatient.js";
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

// Protected routes (Patient only)
router.post('/create', isAuthenticatedPatient, createBooking);
router.post('/:bookingId/cancel', isAuthenticatedPatient, cancelBooking);
router.post('/:bookingId/rate', isAuthenticatedPatient, rateHelper);
router.get('/history', isAuthenticatedPatient, getBookingHistory);

// Protected routes (Helper only)
router.post('/:bookingId/accept', isAuthenticatedHelper, acceptBooking);
router.post('/:bookingId/reject', isAuthenticatedHelper, rejectBooking);
router.post('/:bookingId/verify-otp', isAuthenticatedHelper, verifyBookingOTP); // Helper verifies OTP
router.post('/:bookingId/complete', isAuthenticatedHelper, completeDuty);
router.get('/helper/bookings', isAuthenticatedHelper, getHelperBookings);

export default router;
