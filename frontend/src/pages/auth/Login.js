import { useState, useContext } from "react";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", { email, password })
            login(res.data.token, res.data.user);
        
            if(res.data.user.role ==="admin"){
                navigate("/admin")
            }
            else if(res.data.user.role==="shopkeeper"){
                navigate("/shopkeeper")
            }else{
                navigate("/customer")
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" >Login</button>
                </form>
                <div  className="login-links">
                    <Link to="/register">Register</Link>
                    <Link to="/forget-password">forgetpassword?</Link>
                </div>
            </div>
        </div>

    )
}