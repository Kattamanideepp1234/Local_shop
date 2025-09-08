import express from "express";
import Cart from "../models/Cart.js"
import Product from "../models/Product.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/add", verifyToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user.id })
        if (!cart) {
            cart = new Cart({ user: req.user.id, items:[] })
        }

        const existingItem = cart.items.find(i => i.product.toString() === productId)
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.items.push({ product: productId, quantity: quantity })
        }
        await cart.save();
        const populatedCart = await cart.populate("items.product");
        res.json(populatedCart);


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.get("/", verifyToken, async (req, res) => {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) cart = { items: [] }
    res.json(cart)
})

router.delete("/:productId", verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
        if (!cart) return res.status(400).json({ message: "cart not Found" });

        cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId)

        await cart.save();
        cart = await cart.populate("items.product")
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.messsage })
    }
})

export default router;