import express from "express";
import { isAuthenticatedHelper } from "../middleware/isAuthenticatedHelper.js";
import { helperUpload } from "../middleware/uploadMiddleware.js";
import {
    registerHelper,
    completeRegistrationPayment,
    sendHelperLoginOTP,
    verifyHelperLoginOTP,
    toggleAvailability,
    getHelperProfile,
    updateHelperProfile,
    logoutHelper
} from "../controllers/helperController.js";

const router = express.Router();

// Public routes
router.post('/register', helperUpload, registerHelper);
router.post('/payment', completeRegistrationPayment);
router.post('/login/send-otp', sendHelperLoginOTP);
router.post('/login/verify-otp', verifyHelperLoginOTP);

// Protected routes
router.use(isAuthenticatedHelper);
router.get('/profile', getHelperProfile);
router.put('/profile', updateHelperProfile);
router.put('/availability', toggleAvailability);
router.post('/logout', logoutHelper);

export default router;
