import { createContext,useContext, useState } from "react"

import api from "../api/axios"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)

    const login = async (email, password) => {
        const res = await api.post("/auth/login", {
            email,
            password,
        })

        setAccessToken(res.data.data.accessToken)
        setUser(res.data.data.user)
    }



    const logout = () => {
        setUser(null)
        setAccessToken(null)
    }



    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login,
                logout,
            }}
            >
                {children}
            </AuthContext.Provider>
    )

}

export function useAuth() {
    return useContext(AuthContext)
}