import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
    getPendingHelpers,
    getAllHelpers,
    getHelperDetailsAdmin,
    approveHelper,
    rejectHelper,
    requestResubmission,
    suspendHelper,
    getAllPatients,
    getAllBookings,
    getBookingStats,
    getHelperRatingsReport,
    getCurrentPricing,
    updatePricing
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(isAuthenticated);
router.use(isAdmin);

// Helper Management
router.get('/helpers/pending', getPendingHelpers);
router.get('/helpers', getAllHelpers);
router.get('/helpers/:helperId', getHelperDetailsAdmin);
router.post('/helpers/:helperId/approve', approveHelper);
router.post('/helpers/:helperId/reject', rejectHelper);
router.post('/helpers/:helperId/resubmission', requestResubmission);
router.post('/helpers/:helperId/suspend', suspendHelper);

// Patient Management
router.get('/patients', getAllPatients);

// Booking Management
router.get('/bookings', getAllBookings);
router.get('/bookings/stats', getBookingStats);

// Ratings & Reports
router.get('/ratings', getHelperRatingsReport);

// Pricing Control
router.get('/pricing', getCurrentPricing);
router.put('/pricing', updatePricing);

export default router;
