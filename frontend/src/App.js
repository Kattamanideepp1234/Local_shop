import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ShopkeeperDashboard from "./pages/dashboard/shopkeeperDashboard";
import CustomerDashboard from "./pages/dashboard/customerDashboard";
import AdminDashboard from "./pages/dashboard/adminDashboard";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Cart from "./pages/dashboard/cart";
import MyOrders from "./pages/dashboard/Order";
import ShopkeeperOrders from "./pages/dashboard/shopkeeperOrders";
import ShopkeeperAnalytics from "./pages/dashboard/shopkeeperAnalytics";
import './App.css';
import Navbar from "./context/Navbar";


function App() {
  const { user} = useContext(AuthContext);
  console.log(user);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}`} />} />
        <Route path="/customer" element={user?.role === "customer" ? <CustomerDashboard /> : <Navigate to="/login" />} /> 
        <Route path="/shopkeeper" element={user?.role === "shopkeeper" ? <ShopkeeperDashboard /> : <Navigate to="/login" />} /> 
        <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

      </Routes>
    </Router>

  );
}

export default App;
