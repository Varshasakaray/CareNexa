import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send helper approval email
 */
export const sendHelperApprovalEmail = async (email, helperName, registrationNumber) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Helper Registration Approved - CareNexa',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4CAF50;">🎉 Registration Approved!</h2>
                <p>Dear ${helperName},</p>
                <p>Congratulations! Your helper registration has been approved by the admin.</p>
                <p><strong>Your Helper Registration Number:</strong> <span style="color: #2196F3; font-size: 18px;">${registrationNumber}</span></p>
                <p>You can now log in and start accepting bookings. Make sure to keep your availability status updated.</p>
                <p>Best regards,<br>CareNexa Team</p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
};

/**
 * Send helper rejection email
 */
export const sendHelperRejectionEmail = async (email, helperName, reason) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Helper Registration Status - CareNexa',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f44336;">Registration Update</h2>
                <p>Dear ${helperName},</p>
                <p>We regret to inform you that your helper registration has been rejected.</p>
                <p><strong>Reason:</strong> ${reason || 'Please contact support for more details.'}</p>
                <p>If you believe this is an error, please contact our support team.</p>
                <p>Best regards,<br>CareNexa Team</p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
};

/**
 * Send booking notification to helper
 */
export const sendBookingNotificationToHelper = async (email, helperName, bookingDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'New Booking Request - CareNexa',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2196F3;">New Booking Request</h2>
                <p>Dear ${helperName},</p>
                <p>You have received a new booking request:</p>
                <ul>
                    <li><strong>Patient Address:</strong> ${bookingDetails.patientAddress}</li>
                    <li><strong>Hospital:</strong> ${bookingDetails.hospitalName}</li>
                    <li><strong>Appointment Time:</strong> ${new Date(bookingDetails.appointmentTime).toLocaleString()}</li>
                    <li><strong>Total Price:</strong> ₹${bookingDetails.totalPrice}</li>
                </ul>
                <p>Please log in to accept or reject this booking.</p>
                <p>Best regards,<br>CareNexa Team</p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
};

/**
 * Send booking OTP to patient
 */
export const sendBookingOTPToPatient = async (email, patientName, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Booking OTP - CareNexa',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2196F3;">Booking OTP</h2>
                <p>Dear ${patientName},</p>
                <p>Your booking OTP is: <strong style="font-size: 24px; color: #4CAF50;">${otp}</strong></p>
                <p>Please share this OTP with your helper to verify and start the duty.</p>
                <p>This OTP is valid for 10 minutes.</p>
                <p>Best regards,<br>CareNexa Team</p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
};

/**
 * Send duty completion reminder
 */
export const sendDutyCompletionReminder = async (email, helperName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Duty Completion Reminder - CareNexa',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF9800;">Duty Completion Reminder</h2>
                <p>Dear ${helperName},</p>
                <p>Please remember to mark your duty as completed in the app.</p>
                <p>This helps maintain accurate records and allows patients to rate your service.</p>
                <p>Best regards,<br>CareNexa Team</p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
};

/**
 * Send helper login OTP
 */
export const sendHelperLoginOTP = async (email, helperName, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Helper Login OTP - CareNexa',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2196F3;">Login OTP</h2>
                <p>Dear ${helperName},</p>
                <p>Your login OTP is: <strong style="font-size: 24px; color: #4CAF50;">${otp}</strong></p>
                <p>Please use this OTP to complete your login.</p>
                <p>This OTP is valid for 10 minutes.</p>
                <p>Best regards,<br>CareNexa Team</p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
};
