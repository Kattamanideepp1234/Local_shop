import express from "express";
import Shop from "../models/Shop.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { owner, name, address, phone } = req.body;
        const newShop = new Shop({ owner, name, address, phone });
        await newShop.save();
        res.status(200).json(newShop)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

router.get("/", async (req, res) => {
    try {
        const shops = await Shop.find().populate("owner", "name email");
        res.status(200).json(shops);
    }catch(error){
        res.status(400).json({message: error.message});
    }
})

export default router;