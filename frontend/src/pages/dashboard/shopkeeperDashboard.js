import { useState, useEffect, useContext } from "react";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";
import ShopkeeperOrders from "./shopkeeperOrders";
import ShopkeeperAnalytics from "./shopkeeperAnalytics";


export default function ShopkeeperDashboard() {
    const { token } = useContext(AuthContext)
    const [products, setProducts] = useState([])
    const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });
    const [activeTab, setActiveTab] = useState("products");
    const [editingId, setEditingId] = useState(null);
    const [lowStock, setLowStock] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await API.get("/products/my-products");
                setProducts(res.data);

                const low = res.data.filter(p => p.stock <= 5)
                setLowStock(low)
            } catch (error) {
                alert(error)
            }
        }
        fetchProducts();
    }, []);

    const addProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/products", form, {
                headers: { Authorization: `Bearer ${token}` }
            }
            )
            setProducts([...products, res.data])
            setForm({ name: "", description: "", price: "", stock: "" })
        } catch (err) {
            if (err.response?.status === 403) {
                alert("🚫 You are blocked by Admin. You cannot complete orders.");
            } else {
                alert(err.response?.data?.message || "Failed to complete order");
            }
        }
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const startEdit = (product) => {
        setEditingId(product._id);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
        });
    };

    const updateProduct = async () => {
        try {
            const res = await API.put(`/products/${editingId}`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.map((p) => p._id === editingId ? res.data : p));
            setEditingId(null)
            setForm({ name: "", description: "", price: "", stock: "" })
        } catch (err) {
            if (err.response?.status === 403) {
                alert("🚫 You are blocked by Admin. You cannot complete orders.");
            } else {
                alert(err.response?.data?.message || "Failed to complete order");
            }
        }

    }

    const deleteProduct = async (id) => {
        const res = await API.delete(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        setProducts(products.filter(p => p._id !== id))
    }
    console.log(form)
    return (
        <div>
            <div className="shopkeeper-container">

                {lowStock.length > 0 && (
                    <div className="low-stock-alert">
                        ⚠️ Low Stock Alert: {lowStock.map(p => p.name).join(", ")}
                    </div>)}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <button
                        className={`tab-button ${activeTab === "products" ? "active" : ""}`}
                        onClick={() => setActiveTab("products")}>Products</button>
                    <button
                        className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}>Orders</button>
                    <button
                        className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
                        onClick={() => setActiveTab("analytics")}>Analytics</button>
                </div>
                {activeTab === "products" && <>
                    <form className="shopkeeper-form">
                        <input type="text" name="name" placeholder="Name" value={form.name}
                            onChange={handleChange} required />
                        <input type="text" name="description" placeholder="Description" value={form.description}
                            onChange={handleChange} required />
                        <input type="text" name="price" placeholder="Price" value={form.price}
                            onChange={handleChange} required />
                        <input type="text" name="stock" placeholder="Stock" value={form.stock}
                            onChange={handleChange} required />

                        {editingId ?
                            <button type="button" onClick={updateProduct}>updateProduct</button>
                            : <button type="button" onClick={addProduct}>Add Product</button>
                        }

                    </form>
                    <div className="product-list">
                        {products.map(p => (
                            <div key={p._id} className="product-card">
                                <div><strong>{p.name}</strong>- ₹{p.price} (Stock:{p.stock})
                                    <p>{p.description}</p>
                                </div>
                                <button onClick={() => startEdit(p)}>✏️ Edit</button>
                                <button onClick={() => deleteProduct(p._id)}>🗑️ Delete</button>
                            </div>
                        ))}
                    </div>
                </>}

                {activeTab === "orders" && <ShopkeeperOrders setProducts={setProducts} />}
                {activeTab === "analytics" && <ShopkeeperAnalytics />}

            </div>
        </div>
    )
}