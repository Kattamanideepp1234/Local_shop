import { useState, useEffect } from "react";
import API from "../../api";

export default function MyOrders(){
    const [orders,setOrders]=useState([]);

    const fetchOrders=async()=>{
        try {
            const res = await API.get("/orders/my");
            setOrders(res.data || []);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    }

    useEffect(()=>{
        fetchOrders();
    },[])
    return(
        <div className="myorder-container">
            <h2>My Orders</h2>
            { orders.length===0 ? <p className="empty-orders">No Orders Yet.</p>:(
                <ul className="orders-list">
                    {orders.map(order=>(
                        <li key={order._id} className="order-item">
                            <p>status:<strong>{order.status}</strong></p>
                            <p>Total : ₹{order.totalPrice}</p>
                            <ul>
                                {order.items.map(item=>(
                                    <li key={item.product._id}>
                                        {item.product.name}X{item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )
            }
        </div>
    )
}