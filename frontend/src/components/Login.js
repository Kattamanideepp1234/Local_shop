import { useState,useContext } from "react";
import API from "../api";
import { AuthContext } from "../AuthContext";

export default function Login(){
    const {login}=useContext(AuthContext);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res=await API.post("/auth/login",{email, password})
            login(res.data.token,res.data.user);
            alert("Login Successful ✅");
        }catch(err){
             alert(err.response?.data?.message || "Login failed");
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button type="submit" >Login</button>
        </form>
        
    )
}