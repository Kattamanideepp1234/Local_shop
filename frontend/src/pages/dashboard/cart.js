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
        try{
        const res = await API.delete(`/cart/${id}`);
        setCart(res.data)
        }catch(error){
            alert("Failed to remove Product",error);
        }
    }
    const placeOrder = async () => {
        try{
        await API.post("/orders/place");
        alert("Order Placed");
        fetchCart();}
        catch(error){
            alert("failed to place order",error)
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    const totalPrice = cart.items.reduce(
        (acc, item) => acc + (item.product.price || 0) * item.quantity,
        0
    );



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
                    <div className="cart-total">
                        <strong>Total: ₹{totalPrice}</strong>
                    </div>
                    < button className="place-order-btn" onClick={placeOrder}  disabled={cart.items.length === 0}>Place Order</button>
                </div>)

            }

        </div >
    )
}