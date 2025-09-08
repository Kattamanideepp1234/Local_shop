import { useState, useContext } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
    const { login } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !role) {
        alert("Please fill all fields");
        return;
        }
        try {
            await API.post("/auth/register", { name, email, password, role })

            const res = await API.post("/auth/login", {
                email: email,
                password: password
            });
            login(res.data.token, res.data.user);
            alert("Registation Completed");
            if (res.data.user.role === "admin") {
                navigate("/admin")
            }
            else if (res.data.user.role === "shopkeeper") {
                navigate("/shopkeeper")
            } else {
                navigate("/customer")
            }

        } catch (error) {
            alert(error.response?.data?.message || "Error registering");

        }
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="customer" >Customer</option>
                        <option value="shopkeeper" >Shopkeeper</option>
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>

    )
}