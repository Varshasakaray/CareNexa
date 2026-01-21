import express from "express";
import 'dotenv/config'
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js"
import healthMetricRoute from "./routes/healthMetricRoute.js"
import medicationRoute from "./routes/medicationRoute.js"
import cors from "cors"
import { startMedicationReminderCron } from "./cron/medicationReminderCron.js";

const PORT=process.env.PORT || 8000;
const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    Credential:true
}));

app.use(express.json());
app.use('/user',userRoute) //http://localhost:8000/user/register
app.use('/health',healthMetricRoute) //http://localhost:8000/health
app.use('/medications',medicationRoute) //http://localhost:8000/medications


app.listen((PORT),()=>{
    connectDB();
    startMedicationReminderCron();
    console.log(`server is listening at port :${PORT}`);
})