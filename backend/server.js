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
import cors from "cors"
import { startMedicationReminderCron } from "./cron/medicationReminderCron.js";
import { startBookingAutoFailCron } from "./cron/bookingAutoFailCron.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT=process.env.PORT || 8000;
const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    Credential:true
}));

app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Existing routes
app.use('/user',userRoute) //http://localhost:8000/user/register
app.use('/health',healthMetricRoute) //http://localhost:8000/health
app.use('/medications',medicationRoute) //http://localhost:8000/medications

// Helper Booking System Routes
app.use('/helper',helperRoute) //http://localhost:8000/helper/register
app.use('/patient',patientRoute) //http://localhost:8000/patient/register
app.use('/booking',bookingRoute) //http://localhost:8000/booking/helpers
app.use('/admin',adminRoute) //http://localhost:8000/admin/helpers


app.listen((PORT), async ()=>{
    const dbConnected = await connectDB();
    if (dbConnected) {
        startMedicationReminderCron();
        startBookingAutoFailCron();
    }
    console.log(`server is listening at port :${PORT}`);
})