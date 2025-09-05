import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import shop from "./routes/shop.js";
import product from "./routes/product.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth",authRoutes);
app.use("/api/shop",shop);
app.use("/api/product",product);


const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected Database");
    }
    catch (error) {
        console.log("connection data base failed");
        process.exit(1);
    }
}

connectdb();

app.listen(process.env.PORT, ()=> console.log("server is running on 5000"));