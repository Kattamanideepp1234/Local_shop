import express from "express";
import Order from "../models/Order.js";
import { isShopkeeper, verifyToken } from "../middleware/authMiddleware.js";

const router= express.Router();

router.get("/sales",verifyToken,async(req,res)=>{
    try{
        const orders= await Order.find({shopkeeper:req.user.id, status:"completed"}).populate("items.product")

        const totalRevenue= orders.reduce((sum,o)=> sum+o.totalPrice,0);
        const totalOrders= orders.length

        let productStats={}
        orders.forEach(order=>{
            order.items.forEach(item=>{
                const productName=item.product.name
                productStats[productName]=(productStats[productName] || 0)+ item.quantity;
            })
        })
        res.json({
            totalOrders,
            totalRevenue,
            productStats
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
});

export default router;
