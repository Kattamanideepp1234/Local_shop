import express from "express";
import { verifyToken, isShopkeeper } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const products = await Product.find().populate("owner", "name email");
        res.status(200).json(products);
    }catch(error){
        res.status(400).json({message: error.message});
    }
})

router.post("/",verifyToken, isShopkeeper, async (req, res) => {
    console.log("Incoming Body:", req.body);
    try {
        const {name, description, price, stock } = req.body;
        const newProduct = new Product({ name, description, price:Number(price), stock:Number(stock),owner: req.user.id });
        await newProduct.save();
        res.status(200).json(newProduct)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

router.put("/:id",verifyToken, isShopkeeper, async(req,res)=>{
    try{
        const product= await Product.findOneAndUpdate({_id:req.params.id, owner:req.user.id},
            req.body,
            {new:true},
        )
        if(!product) return res.status(500).json({message:"Product not Found"})
        res.status(200).json(product)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.delete("/:id", verifyToken, isShopkeeper, async(req,res)=>{
    try{
        const product = await Product.findOneAndDelete({_id:req.params.id, owner:req.user.id})
        if(!product) return res.status(500).json({message:"Product not Found"})
        res.status(200).json({message:"Deleted Successfully"})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

export default router;