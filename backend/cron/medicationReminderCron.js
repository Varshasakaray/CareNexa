import cron from "node-cron";
import mongoose from "mongoose";
import { Medication } from "../models/medicationModel.js";
import { sendMedicationReminder } from "../emailVerify/medicationReminder.js";

/** Normalize time to "HH:mm" so "9:00" and "09:00" match the same group */
const normalizeTime = (timeStr) => {
    const parts = String(timeStr).trim().split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Run every minute to check for medications due
export const startMedicationReminderCron = () => {
    cron.schedule("* * * * *", async () => {
        try {
            // Check if database is connected
            if (mongoose.connection.readyState !== 1) {
                return; // Skip if DB not connected
            }

            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            // Find all active medications with reminders enabled
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

            // Group medications by user + normalized time (one group per user per time slot)
            const userTimeGroups = {};

            for (const medication of medications) {
                if (!medication.userId || !medication.userId.email) continue;

                const userId = medication.userId._id.toString();
                const username = medication.userId.username;
                const lastReminder = medication.lastReminderSent;
                const timeSinceLastReminder = lastReminder
                    ? (now - lastReminder) / 1000 / 60 / 60
                    : 24;
                if (timeSinceLastReminder < 1) continue;

                const seenTimesForThisMed = new Set();

                for (const time of medication.times || []) {
                    const normalized = normalizeTime(time);
                    if (seenTimesForThisMed.has(normalized)) continue;
                    const [hours, minutes] = normalized.split(':').map(Number);
                    const medTime = new Date(now);
                    medTime.setHours(hours, minutes, 0, 0);
                    const diff = Math.abs(now - medTime) / 1000 / 60;
                    if (diff > 1) continue;

                    seenTimesForThisMed.add(normalized);
                    const groupKey = `${userId}_${normalized}`;

                    if (!userTimeGroups[groupKey]) {
                        userTimeGroups[groupKey] = {
                            userId,
                            username,
                            email: medication.userId.email,
                            time: normalized,
                            medications: [],
                            medIds: new Set()
                        };
                    }

                    const g = userTimeGroups[groupKey];
                    const medId = medication._id.toString();
                    if (g.medIds.has(medId)) continue;
                    g.medIds.add(medId);
                    g.medications.push({
                        ...medication.toObject(),
                        matchedTime: normalized
                    });
                }
            }

            // Send one email per user-time group
            for (const groupKey of Object.keys(userTimeGroups)) {
                const group = userTimeGroups[groupKey];
                if (group.medications.length === 0) continue;

                try {
                    const sent = await sendMedicationReminder(
                        group.email,
                        group.username,
                        group.medications,
                        group.time
                    );

                    if (sent) {
                        const medicationIds = group.medications.map((m) => m._id);
                        await Medication.updateMany(
                            { _id: { $in: medicationIds } },
                            { $set: { lastReminderSent: now } }
                        );
                        const names = group.medications.map((m) => m.name).join(', ');
                        console.log(`Reminder sent for ${group.medications.length} medication(s) to ${group.email}: ${names}`);
                    }
                } catch (err) {
                    console.error(`Error sending reminder to ${group.email}:`, err);
                }
            }
        } catch (error) {
            console.error("Error in medication reminder cron job:", error);
        }
    });

    console.log("Medication reminder cron job started");
};
