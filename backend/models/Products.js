import mongoose, { Schema } from "mongoose";

const productSchema=mongoose.Schema(
    {
        shop:{type: mongoose.Schema.Types.ObjectId, ref:"Shop"},
        product:{type:String, required:true},
        description:{type:String, required:true},
        price:{type:Number, required:true}
    },
    {timestamps:true}
);

export default mongoose.model("Product",productSchema);