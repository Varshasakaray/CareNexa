import { Medication } from "../models/medicationModel.js";
import { sendMedicationReminder } from "../emailVerify/medicationReminder.js";

// Add a new medication
export const addMedication = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, dosage, frequency, times, startDate, endDate, reminderEnabled, emailReminder, notes } = req.body;

        if (!name || !dosage || !frequency || !times || !startDate) {
            return res.status(400).json({
                success: false,
                message: "Name, dosage, frequency, times, and start date are required"
            });
        }

        if (!Array.isArray(times) || times.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Times must be a non-empty array"
            });
        }

        const medication = await Medication.create({
            userId,
            name,
            dosage,
            frequency,
            times,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            reminderEnabled: reminderEnabled !== undefined ? reminderEnabled : true,
            emailReminder: emailReminder !== undefined ? emailReminder : true,
            notes: notes || ""
        });

        return res.status(201).json({
            success: true,
            message: "Medication added successfully",
            data: medication
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all medications for a user
export const getMedications = async (req, res) => {
    try {
        const userId = req.userId;
        const { activeOnly } = req.query;

        let query = { userId };
        
        if (activeOnly === "true") {
            query.isActive = true;
            query.$or = [
                { endDate: null },
                { endDate: { $gte: new Date() } }
            ];
        }

        const medications = await Medication.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: medications,
            count: medications.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single medication by ID
export const getMedicationById = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const medication = await Medication.findOne({ _id: id, userId });

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: "Medication not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: medication
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a medication
export const updateMedication = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const updateData = req.body;

        const medication = await Medication.findOne({ _id: id, userId });

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: "Medication not found"
            });
        }

        // Update fields
        if (updateData.name !== undefined) medication.name = updateData.name;
        if (updateData.dosage !== undefined) medication.dosage = updateData.dosage;
        if (updateData.frequency !== undefined) medication.frequency = updateData.frequency;
        if (updateData.times !== undefined) medication.times = updateData.times;
        if (updateData.startDate !== undefined) medication.startDate = new Date(updateData.startDate);
        if (updateData.endDate !== undefined) medication.endDate = updateData.endDate ? new Date(updateData.endDate) : null;
        if (updateData.reminderEnabled !== undefined) medication.reminderEnabled = updateData.reminderEnabled;
        if (updateData.emailReminder !== undefined) medication.emailReminder = updateData.emailReminder;
        if (updateData.notes !== undefined) medication.notes = updateData.notes;
        if (updateData.isActive !== undefined) medication.isActive = updateData.isActive;

        await medication.save();

        return res.status(200).json({
            success: true,
            message: "Medication updated successfully",
            data: medication
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a medication
export const deleteMedication = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const medication = await Medication.findOneAndDelete({ _id: id, userId });

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: "Medication not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Medication deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get medications due for reminder
export const getMedicationsDueForReminder = async () => {
    try {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const medications = await Medication.find({
            isActive: true,
            reminderEnabled: true,
            emailReminder: true,
            startDate: { $lte: now },
            $or: [
                { endDate: null },
                { endDate: { $gte: currentDate } }
            ]
        }).populate('userId', 'email username');

        const dueMedications = medications.filter(med => {
            return med.times.some(time => {
                const [hours, minutes] = time.split(':').map(Number);
                const medTime = new Date();
                medTime.setHours(hours, minutes, 0, 0);
                
                // Check if time matches current time (within 1 minute window)
                const diff = Math.abs(now - medTime) / 1000 / 60; // difference in minutes
                
                // Also check if reminder hasn't been sent in the last hour
                const lastReminder = med.lastReminderSent;
                const timeSinceLastReminder = lastReminder 
                    ? (now - lastReminder) / 1000 / 60 / 60 // hours
                    : 24; // If never sent, treat as 24 hours ago
                
                return diff <= 1 && timeSinceLastReminder >= 1;
            });
        });

        return dueMedications;
    } catch (error) {
        console.error("Error getting medications due for reminder:", error);
        return [];
    }
};
