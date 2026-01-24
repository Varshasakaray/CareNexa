import { Patient } from '../models/patientModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Session } from '../models/sessionModel.js';
import { verifyMail } from '../emailVerify/verifyMail.js';

/**
 * Patient Registration
 */
export const registerPatient = async (req, res) => {
    try {
        const { fullName, mobileNumber, email, password, address, pincode } = req.body;

        if (!fullName || !mobileNumber || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All required fields are missing'
            });
        }

        // Check if patient already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '10m' });

        const newPatient = await Patient.create({
            fullName,
            mobileNumber,
            email,
            password: hashedPassword,
            address: address || null,
            pincode: pincode || null,
            token
        });

        // Send verification email
        verifyMail(token, email);

        return res.status(201).json({
            success: true,
            message: 'Patient registered successfully. Please verify your email.',
            data: {
                patientId: newPatient._id,
                email: newPatient.email
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
 * Patient Login
 */
export const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const passwordCheck = await bcrypt.compare(password, patient.password);
        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Auto-verify if not verified (for development/testing)
        // In production, you should require email verification
        if (!patient.isVerified) {
            patient.isVerified = true;
            patient.token = null;
            await patient.save();
        }

        // Clear existing session
        const existingSession = await Session.findOne({ userId: patient._id });
        if (existingSession) {
            await Session.deleteOne({ userId: patient._id });
        }

        // Create new session
        await Session.create({ userId: patient._id });

        // Generate tokens
        const accessToken = jwt.sign({ id: patient._id }, process.env.SECRET_KEY, { expiresIn: '10d' });
        const refreshToken = jwt.sign({ id: patient._id }, process.env.SECRET_KEY, { expiresIn: '30d' });

        patient.isLoggedIn = true;
        await patient.save();

        const patientData = patient.toObject();
        delete patientData.password;

        return res.status(200).json({
            success: true,
            message: `Welcome ${patient.fullName}`,
            accessToken,
            refreshToken,
            patient: patientData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Patient Profile
 */
export const getPatientProfile = async (req, res) => {
    try {
        const patientId = req.userId;
        const patient = await Patient.findById(patientId).select('-password');
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Patient Email Verification
 */
export const verifyPatientEmail = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing or invalid"
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                });
            }
            return res.status(400).json({
                success: false,
                message: "Token verification failed"
            });
        }

        const patient = await Patient.findOne({ email: decoded.email });
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        patient.token = null;
        patient.isVerified = true;
        await patient.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Patient Logout
 */
export const logoutPatient = async (req, res) => {
    try {
        const patientId = req.userId;
        await Session.deleteMany({ userId: patientId });
        await Patient.findByIdAndUpdate(patientId, { isLoggedIn: false });

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
