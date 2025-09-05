import React from "react";
import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Navbar from "./Navbar";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import './App.css';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
          />
        <Route path="/forget-password" element={<ForgetPassword/>}/>
        <Route path ="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
