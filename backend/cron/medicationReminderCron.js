import cron from "node-cron";
import { Medication } from "../models/medicationModel.js";
import { sendMedicationReminder } from "../emailVerify/medicationReminder.js";

// Run every minute to check for medications due
export const startMedicationReminderCron = () => {
    cron.schedule("* * * * *", async () => {
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

            for (const medication of medications) {
                const isDue = medication.times.some(time => {
                    const [hours, minutes] = time.split(':').map(Number);
                    const medTime = new Date();
                    medTime.setHours(hours, minutes, 0, 0);
                    
                    // Check if time matches current time (within 1 minute window)
                    const diff = Math.abs(now - medTime) / 1000 / 60; // difference in minutes
                    
                    // Also check if reminder hasn't been sent in the last hour
                    const lastReminder = medication.lastReminderSent;
                    const timeSinceLastReminder = lastReminder 
                        ? (now - lastReminder) / 1000 / 60 / 60 // hours
                        : 24; // If never sent, treat as 24 hours ago
                    
                    return diff <= 1 && timeSinceLastReminder >= 1;
                });

                if (isDue && medication.userId && medication.userId.email) {
                    const sent = await sendMedicationReminder(
                        medication.userId.email,
                        medication.userId.username,
                        medication
                    );

                    if (sent) {
                        // Update last reminder sent time
                        medication.lastReminderSent = new Date();
                        await medication.save();
                        console.log(`Reminder sent for medication: ${medication.name} to ${medication.userId.email}`);
                    }
                }
            }
        } catch (error) {
            console.error("Error in medication reminder cron job:", error);
        }
    });

    console.log("Medication reminder cron job started");
};
