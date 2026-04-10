import express from "express";
import 'dotenv/config'
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js"
import healthMetricRoute from "./routes/healthMetricRoute.js"
import medicationRoute from "./routes/medicationRoute.js"
import helperRoute from "./routes/helperRoute.js"
import patientRoute from "./routes/patientRoute.js"
import bookingRoute from "./routes/bookingRoute.js"
import adminRoute from "./routes/adminRoute.js"
import chatRoute from "./routes/chatRoute.js"
import cors from "cors"
import { startMedicationReminderCron } from "./cron/medicationReminderCron.js";
import { startBookingAutoFailCron } from "./cron/bookingAutoFailCron.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import http from "http";
import { initSocket } from "./socket/chatSocket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT=process.env.PORT || 8000;
const app=express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

app.use(cors({
    origin:'http://localhost:5173',
    Credential:true
}));

app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Existing routes
app.use('/user',userRoute)
app.use('/health',healthMetricRoute)
app.use('/medications',medicationRoute)

// Helper Booking System Routes
app.use('/helper',helperRoute)
app.use('/patient',patientRoute)
app.use('/booking',bookingRoute)
app.use('/admin',adminRoute)
app.use('/chat',chatRoute)

server.listen((PORT), async ()=>{
    // Ensure uploads directory exists on startup
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("Uploads directory created on startup");
    }

    const dbConnected = await connectDB();
    if (dbConnected) {
        startMedicationReminderCron();
        startBookingAutoFailCron();
    }
    console.log(`server is listening at port :${PORT}`);
})