import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["customer", "shopkeeper", "admin"], default: "customer" },
        resetToken: { type: String },
        resetTokenExpiry: { type: Date },
        isBlocked: {type:Boolean, default:false},
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema)