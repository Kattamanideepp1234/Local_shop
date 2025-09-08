import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="navbar">
            <h1>Local Shop</h1>
            {user ? (
                <div className="navbar-links">
                    <span className="navbar-user">Welcome {user.name}({user.role})</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div className="navbar-links">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            )

            }
        </div>
    )
}