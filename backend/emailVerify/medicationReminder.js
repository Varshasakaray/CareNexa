import nodemailer from "nodemailer";
import "dotenv/config";

// Send medication reminder email
export const sendMedicationReminder = async (email, username, medication) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const currentTime = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `💊 Medication Reminder: ${medication.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">💊 Medication Reminder</h2>
                    <p>Hello ${username},</p>
                    <p>This is a friendly reminder to take your medication:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #1f2937;">${medication.name}</h3>
                        <p><strong>Dosage:</strong> ${medication.dosage}</p>
                        <p><strong>Time:</strong> ${currentTime}</p>
                        <p><strong>Frequency:</strong> ${medication.frequency}</p>
                        ${medication.notes ? `<p><strong>Notes:</strong> ${medication.notes}</p>` : ''}
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">Please take your medication as prescribed by your healthcare provider.</p>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">This is an automated reminder from CareNexa.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending medication reminder email:", error);
        return false;
    }
};
