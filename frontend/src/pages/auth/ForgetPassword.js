import { useState } from "react";
import API from "../../api";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("auth/forget-password", { email })
            setMessage(res.data.message)
        } catch (error) {
            setMessage(error.response.data.message || "Error")
        }

    }

    return (
        <div>
            <h2>Forget Password</h2>
            <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
            <p>{message}</p>
        </div>
    )
}