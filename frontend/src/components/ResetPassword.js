import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api"

export default function ResetPassword(){
    const {token}=useParams();
    const [password,setPassword]=useState("");
    const [message,setMessage]=useState("");

    const handleSubmit=(e)=>{
        e.preventDefault();
        try{
            const res=API.post(`/auth/reset-password/${token}`,{password})
            setMessage(res.data.message);
        }catch(error){
            setMessage(error.response.data.message || "Error")
        }
    }

    return(
        <div>
            <h2>Reset Password</h2>
            <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
            <button onClick={handleSubmit}>Reset Password</button>
        </div>
    )
}