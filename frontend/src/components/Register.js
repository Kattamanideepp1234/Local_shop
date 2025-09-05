import { useState } from "react";
import API from "../api";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const handleSubmit = async (e) => {
         e.preventDefault();
        try {
            await API.post("/auth/register", { name, email, password, role })
            alert("Registation Completed")
        } catch (error) {
            alert(error.response?.data?.message || "Error registering");

        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer" selected>Customer</option>
                <option value="owner" >Owner</option>
            </select>
            <button type="submit">Submit</button>
        </form>

    )
}