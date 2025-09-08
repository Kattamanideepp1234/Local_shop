import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import products from "./routes/products.js"
import carts from "./routes/cart.js";
import orders from "./routes/order.js";
import analytics from './routes/analytics.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth",authRoutes);
app.use("/api/products",products);
app.use("/api/cart",carts);
app.use("/api/orders",orders);
app.use("/api/analytics",analytics);



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