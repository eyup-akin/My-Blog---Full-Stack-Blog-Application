import { createContext,useContext, useState } from "react"

import api, { setAccessToken } from "../api/axios"


const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessTokenState] = useState(null)

    const login = async (email, password) => {
        const res = await api.post("/auth/login", {
            email,
            password,
        })

        const token = res.data.data.accessToken

        setAccessTokenState(token) //react state
        setAccessToken(token) // interceptor a token veriyoruz
        setUser(res.data.data.user)
    }



    const logout = () => {
        setUser(null)
        setAccessTokenState(null)
        setAxiosToken(null)
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