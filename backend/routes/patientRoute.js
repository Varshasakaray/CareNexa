import express from "express";
import { isAuthenticatedPatient } from "../middleware/isAuthenticatedPatient.js";
import {
    registerPatient,
    loginPatient,
    getPatientProfile,
    logoutPatient,
    verifyPatientEmail
} from "../controllers/patientController.js";

const router = express.Router();

// Public routes
router.post('/register', registerPatient);
router.post('/login', loginPatient);
router.post('/verify', verifyPatientEmail); // Email verification

// Protected routes
router.use(isAuthenticatedPatient);
router.get('/profile', getPatientProfile);
router.post('/logout', logoutPatient);

export default router;
