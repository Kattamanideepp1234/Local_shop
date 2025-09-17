import mongoose from "mongoose";

const orderSchema=mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    shopkeeper:{type: mongoose.Schema.Types.ObjectId, ref:"User"},
    items:[{
        product:{type:mongoose.Schema.Types.ObjectId, ref:"product"},
        quantity:Number,
        price:Number
    }],
    totalPrice:{type:Number, required: true},
    status:{type:String, enum:["pending","processing", "completed","Cancelled by admin"], default: "pending"}
},{timestamps:true});

export default mongoose.model("Orders",orderSchema);