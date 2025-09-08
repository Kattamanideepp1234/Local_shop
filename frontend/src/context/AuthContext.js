import { createContext, useState, useEffect } from "react";

export const AuthContext= createContext();

export const AuthProvider=({children})=>{
    const [user, setUser]=useState(null);
    const [token, setToken]=useState(null);

    useEffect(()=>{
        const savedUser= localStorage.getItem("user");
        const savedToken= localStorage.getItem("token");

        if(savedUser && savedToken){
            setUser(JSON.parse(savedUser))
            setToken(savedToken)
        }
    },[]);

    const login=(jwtToken,userData)=>{
        setUser(userData);
        setToken(jwtToken)
        localStorage.setItem("user",JSON.stringify(userData))
        localStorage.setItem("token",jwtToken);

    }

    const logout=()=>{
        setUser("")
        setToken("")
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }

    return(
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}