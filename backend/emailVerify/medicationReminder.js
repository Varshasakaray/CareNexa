import nodemailer from "nodemailer";
import "dotenv/config";

// Send medication reminder email for multiple medications
export const sendMedicationReminder = async (email, username, medications, reminderTime) => {
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

        // Build medication list HTML
        const medicationList = medications.map((medication, index) => `
            <div style="background: linear-gradient(135deg, #00b4d8 0%, #caf0f8 100%); padding: 20px; border-radius: 12px; margin: 15px 0; border-left: 4px solid #00b4d8;">
                <h3 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 20px;">💊 ${medication.name}</h3>
                <div style="background-color: rgba(255, 255, 255, 0.9); padding: 12px; border-radius: 8px; margin-top: 10px;">
                    <p style="margin: 5px 0; color: #333;"><strong>Dosage:</strong> ${medication.dosage}</p>
                    <p style="margin: 5px 0; color: #333;"><strong>Frequency:</strong> ${medication.frequency}</p>
                    ${medication.notes ? `<p style="margin: 5px 0; color: #666; font-style: italic;"><strong>Notes:</strong> ${medication.notes}</p>` : ''}
                </div>
            </div>
        `).join('');

        const subjectText = medications.length === 1 
            ? `💊 Medication Reminder: ${medications[0].name}`
            : `💊 Medication Reminder: ${medications.length} Medications Due`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subjectText,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7ede2;">
                    <div style="background: linear-gradient(135deg, #00b4d8 0%, #bbd0ff 100%); padding: 25px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">💊 Medication Reminder</h1>
                        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Time: ${currentTime}</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Hello <strong>${username}</strong>,</p>
                        <p style="color: #555; font-size: 15px; line-height: 1.6;">
                            ${medications.length === 1 
                                ? 'This is a friendly reminder to take your medication:'
                                : `You have <strong>${medications.length} medications</strong> to take at this time:`
                            }
                        </p>
                        ${medicationList}
                        <div style="background-color: #caf0f8; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #00b4d8;">
                            <p style="color: #1a1a1a; margin: 0; font-size: 14px; font-weight: 600;">
                                ⏰ Please take your ${medications.length === 1 ? 'medication' : 'medications'} as prescribed by your healthcare provider.
                            </p>
                        </div>
                        <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center; border-top: 1px solid #eae0d5; padding-top: 20px;">
                            This is an automated reminder from <strong style="color: #00b4d8;">CareNexa</strong>
                        </p>
                    </div>
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
