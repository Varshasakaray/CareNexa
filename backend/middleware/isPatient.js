import { Patient } from '../models/patientModel.js';

export const isPatient = async (req, res, next) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const patient = await Patient.findById(userId);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        req.patient = patient;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
