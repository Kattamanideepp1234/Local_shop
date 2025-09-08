import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place", verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
        if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is Empty" });

        const shopkeeperId = cart.items[0].product.owner._id;
        console.log(shopkeeperId)
        let totalPrice = 0;
        const orderItems = cart.items.map(item => {
            totalPrice += item.product.price * item.quantity
            return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            }
        })
        const order = new Order({
            user: req.user.id,
            shopkeeper: shopkeeperId,
            items: orderItems,
            totalPrice
        })
        await order.save();
        cart.items = [];
        await cart.save();
        

        res.json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
        { _id: req.params.id, shopkeeper: req.user.id },
        { status },
        { new: true },
        );

        if (!order) {
            return res.status(500).json({ message: "Order not found"})
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

})

router.get("/shopkeeper", verifyToken, async (req, res) => {
    const orders = await Order.find({ shopkeeper: req.user.id }).populate("items.product user")
    res.json(orders)
})

router.get("/my", verifyToken, async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate("items.product")
    res.json(orders)
})

export default router;