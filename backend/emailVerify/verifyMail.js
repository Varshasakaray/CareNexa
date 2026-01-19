import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, email) => {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, "template.hbs"),
    "utf-8"
  );
  const template = Handlebars.compile(emailTemplateSource);
  const htmlToSend = template({ token: encodeURIComponent(token) });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailConfigurations = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: htmlToSend,
  };
  try {
    const info = await transporter.sendMail(emailConfigurations);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Email error:", error.message);
  }
};
