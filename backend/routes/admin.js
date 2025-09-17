import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { isAdmin,verifyToken } from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/users",verifyToken,isAdmin,async(req,res)=>{
    try{
        const users= await User.find().select("-password");
        res.status(200).json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
});

router.put("/:id/block",verifyToken, isAdmin,async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user) return res.status(400).json({message: "User not Found"});

        user.isBlocked= !user.isBlocked;
        await user.save()
        res.status(200).json({message: `User ${user.isBlocked ? "Blocked":"UnBlocked"}`})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get("/products",verifyToken, isAdmin, async(req,res)=>{
    try{
        const products=await Product.find().populate("owner","name email");
        res.json(products);
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.delete("/products/:id",verifyToken, isAdmin, async(req,res)=>{
    try{
        const product= await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(500).json({message: "Product not Found"})
        
        res.json(product);
    }catch(error){
        res.status(500).json({message: error.message})
    }
});

router.get("/orders",verifyToken, isAdmin, async( req,res)=>{
    try{
        const orders= await Order.find().populate("user", "name email").populate("items.product","name price");
        res.json(orders);
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.put("/orders/:id",verifyToken, isAdmin, async(req,res)=>{
    try{
        const order= await Order.findById(req.params.id);
        if(order) return res.status(400).json({message: "Order not Found"});

        order.status="Cancelled by admin";
        await order.save();
        res.status(200).json(order);
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

export default router;