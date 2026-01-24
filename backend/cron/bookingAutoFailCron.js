import cron from 'node-cron';
import mongoose from 'mongoose';
import { Booking } from '../models/bookingModel.js';
import { Helper } from '../models/helperModel.js';

/**
 * Auto-fail bookings where helper didn't respond within deadline
 * Runs every minute
 */
export const startBookingAutoFailCron = () => {
    cron.schedule('* * * * *', async () => {
        try {
            // Check if database is connected
            if (mongoose.connection.readyState !== 1) {
                return; // Skip if DB not connected
            }

            const now = new Date();
            
            // Find bookings that are pending and past their response deadline
            const expiredBookings = await Booking.find({
                status: 'pending',
                helperResponseDeadline: { $lt: now }
            });

            for (const booking of expiredBookings) {
                // Auto-fail the booking
                booking.status = 'auto_failed';
                await booking.save();

                // Set helper back to available
                const helper = await Helper.findById(booking.helperId);
                if (helper) {
                    helper.isAvailable = true;
                    await helper.save();
                }
            }

            if (expiredBookings.length > 0) {
                console.log(`Auto-failed ${expiredBookings.length} booking(s) due to no helper response`);
            }
        } catch (error) {
            console.error('Error in booking auto-fail cron:', error);
        }
    });

    console.log('Booking auto-fail cron job started');
};
