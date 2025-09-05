import express from "express";
import Shop from "../models/Products.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {shop, product, description, price } = req.body;
        const newProduct = new Shop({ shop, product, description, price });
        await newProduct.save();
        res.status(200).json(newProduct)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await Shop.find().populate("shop", "name address");
        res.status(200).json(products);
    }catch(error){
        res.status(400).json({message: error.message});
    }
})

export default router;