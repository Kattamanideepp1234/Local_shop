import { useState, useEffect, useContext } from "react";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "products") fetchProducts();
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  const toggleBlock = async (userId) => {
    try {
      await API.put(`/admin/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user status");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await API.delete(`/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await API.put(`/admin/orders/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order");
    }
  };

  return (
    <div className="admin-container">

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`tab-button ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      {activeTab === "users" && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isBlocked ? "Blocked" : "Active"}</td>
                <td>
                  <button onClick={() => toggleBlock(user._id)}>
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "products" && (
        <div className="product-list">
          {products.map((p) => (
            <div key={p._id} className="product-card">
              <div>
                <strong>{p.name}</strong> - ₹{p.price} | Stock:{p.stock}
                <p>{p.description}</p>
              </div>
              <button onClick={() => deleteProduct(p._id)}>🗑️ Delete</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div>
                <strong>Order by: </strong>{order.user?.name} ({order.user?.email})
                <p>Status: {order.status}</p>
                <div>
                  Items:
                  {order.items.map((item) => (
                    <div key={item.product._id}>
                      {item.product.name} - ₹{item.product.price} x {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
              {order.status==="pending" &&
              <button onClick={() => cancelOrder(order._id)}>Cancel Order</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
