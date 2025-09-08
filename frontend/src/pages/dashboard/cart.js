import { useState, useEffect } from "react";
import API from "../../api";

export default function Cart() {
    const [cart, setCart] = useState({ items: [] })

    const fetchCart = async () => {
        try {
            const res = await API.get("/cart");
            setCart(res.data || { items: [] })
        } catch (error) {
            alert(error)
        }
    }

    const removeProduct = async (id) => {
        const res = await API.delete(`/cart/${id}`);
        setCart(res.data)
    }
    const placeOrder = async () => {
        await API.post("/orders/place");
        alert("Order Placed");
        fetchCart();
    }

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div className="cart-container">
            <h2>My Cart</h2>
            {cart.items.length === 0 ?
                (<p className="empty-cart">Your Cart is Empty</p>) :
                (<div className="cart-list">
                    <ul>
                        {cart.items.map((item) => (
                            <li key={item.product._id} className="cart-item">
                                <span>{item.product.name} X {item.quantity}</span>
                                <button className="card-btn" onClick={() => removeProduct(item.product._id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    < button className="place-order-btn" onClick={placeOrder}>Place Order</button>
                </div>)

            }

        </div >
    )
}