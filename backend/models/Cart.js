import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: { type: Number, requried: true, default: 1 }
    },],
},
    { timestamps: true }
);

export default mongoose.model("Cart",cartSchema);