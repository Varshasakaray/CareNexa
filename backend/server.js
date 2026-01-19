import express from "express";
import 'dotenv/config'
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js"
import cors from "cors"

const PORT=process.env.PORT || 8000;
const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    Credential:true
}));

app.use(express.json());
app.use('/user',userRoute) //http://localhost:8000/user/register


app.listen((PORT),()=>{
    connectDB();
    console.log(`server is listening at port :${PORT}`);
})