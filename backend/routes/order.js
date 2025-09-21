import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { verifyToken ,checkNotBlocked} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place", verifyToken,checkNotBlocked, async (req, res) => {
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

router.put("/:id/complete",verifyToken,checkNotBlocked, async(req,res)=>{
    try{
        const order=await Order.findById(req.params.id).populate("items.product");
        if(!order) return res.status(404).json({message: "order not found"});

        if(order.status==="completed"){
            return res.status(400).json({message: "order is already completed"})
        }

        for(let item of order.items){
            const product=await Product.findById(item.product._id);
            if(product.stock<item.quantity){
                return res.status(405).json({message: `Not enough stock for ${product.name}`})
            }
            product.stock-=item.quantity;
            await product.save();
        }
        order.status="completed";
        await order.save();
        res.json({message:"Order completed and stock updated",order})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.put("/:id", verifyToken,checkNotBlocked, async (req, res) => {
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
    const orders = await Order.find({ shopkeeper: req.user.id }).populate("items.product user").sort({createdAt: -1})
    res.json(orders)
})

router.get("/my", verifyToken, async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate("items.product").sort({createdAt: -1})
    res.json(orders)
})

export default router;