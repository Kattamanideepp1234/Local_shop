import mongoose, { Schema } from "mongoose";

const shopSchema=mongoose.Schema(
    {
        owner:{type: mongoose.Schema.Types.ObjectId, ref:"User"},
        name:{type:String, required:true},
        address:{type:String, required:true},
        phone:{type:String, required:true}
    },
    {timestamps:true}
);

export default mongoose.model("Shop",shopSchema);