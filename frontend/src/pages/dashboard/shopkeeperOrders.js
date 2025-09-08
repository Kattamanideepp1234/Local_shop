import { useState, useEffect } from "react";
import API from "../../api";

export default function ShopkeeperOrders() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/orders/shopkeeper");
            setOrders(res.data || []);
        } catch (err) {
            console.error("Failed to fetch shopkeeper orders:", err);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (OrderId, status) => {
        await API.put(`/orders/${OrderId}`, { status });
        fetchOrders();
    }

    return (
        <div className="myorder-container">
            <h2>Incoming Orders</h2>
            {orders.length === 0 ? <p className="empty-orders">No Orders Yet.</p> : (
                <ul className="orders-list">
                    {orders.map(order => (
                        <li key={order._id} className="order-item">
                            <p>Customer:{order.user.name}</p>
                            <p>Total: ${order.totalPrice}</p>
                            <p>Status:{order.status}</p>
                            <ul>
                                {order.items.map(i => (
                                    <li key={i.product._id}>{i.product.name}X{i.quantity}</li>
                                ))
                                }
                            </ul>
                            <button onClick={()=>updateStatus(order._id, "processing")}>Processing</button>
                            <button onClick={()=>updateStatus(order._id, "completed")}>Completed</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}