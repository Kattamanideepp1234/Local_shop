import { useState, useEffect, useContext } from "react";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";

export default function ShopkeeperOrders({setProducts}) {
    const [orders, setOrders] = useState([]);
    const { token } = useContext(AuthContext);

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

    const completeOrder = async (id) => {
        try {
            const res = await API.put(`/orders/${id}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(res.data.message);
            setOrders(orders.map(o => o._id === id ? res.data.order : o));
            const productsRes = await API.get("/products");
            setProducts(productsRes.data);

        } catch (err) {
            alert(err.response?.data?.message || "Failed to complete order");
        }
    }


    return (
        <div className="myorder-container">
            <h2>Incoming Orders</h2>
            {orders.length === 0 ? <p className="empty-orders">No Orders Yet.</p> : (
                <ul className="orders-list">
                    {orders.map(order => (
                        <li key={order._id} className="order-item">
                            <p>Customer:{order.user.name}</p>
                            <p>Total: ₹{order.totalPrice}</p>
                            <ul>
                                {order.items.map(i => (
                                    <li key={i.product._id}>{i.product.name}X{i.quantity}</li>
                                ))
                                }
                            </ul>
                            <p>Status:{order.status}</p>
                            {order.status === "pending" &&
                                <button onClick={() => completeOrder(order._id)}>✅ Complete Order</button>
                            }
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}