import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav>
            <Link to="/">Home</Link>
            {!user ?
                (<>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/forget-password">forgetpassword?</Link>
                </>) : (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                )
            }
        </nav>

    )
}