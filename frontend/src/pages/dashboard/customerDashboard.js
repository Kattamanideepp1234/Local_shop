import { useEffect, useState, useContext } from "react";
import API from "../../api";
import Cart from "./cart";
import MyOrders from "./Order";
import { AuthContext } from "../../context/AuthContext";


export default function CustomerDashboard() {
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("products");
    const { token } = useContext(AuthContext);
    const [search, setSearch] = useState("")

    const fetchProducts = async () => {
        try {
            const res = await API.get(`/products?search=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (error) {
            alert(error);
        }
    };
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search])

    const addToCart = async (productId) => {
        try {
            await API.post(
                "/cart/add",
                { productId, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Product added to cart!");
        } catch (err) {
            console.error("Failed to add to cart:", err);
            alert("Failed to add product to cart");
        }
    };

    return (
        <div >
            <div className="customer-container">
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <button
                        className={`tab-button ${activeTab === "products" ? "active" : ""}`}
                        onClick={() => setActiveTab("products")}>Products</button>
                    <button className={`tab-button ${activeTab === "cart" ? "active" : ""}`}
                        onClick={() => setActiveTab("cart")}>My Carts</button>
                    <button className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}>My Orders</button>
                </div>
                {activeTab === "products" && <>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ marginBottom: "1rem", padding: "0.5rem" }}
                    />
                    <div className="product-list">
                        {products.map(p => (
                            <div className="product-card" key={p._id}>
                                <div>
                                    <strong>{p.name}</strong>
                                    <div className="product-meta">
                                        ₹{p.price} &nbsp; | &nbsp;Stock:{p.stock}
                                    </div>
                                </div>
                                <p>{p.description}</p>
                                <button onClick={() => addToCart(p._id)}>Add to Cart</button>
                            </div>
                        ))}
                    </div>
                </>}
                {activeTab === "cart" && <Cart />}
                {activeTab === "orders" && <MyOrders />}

            </div>
        </div>
    )
}