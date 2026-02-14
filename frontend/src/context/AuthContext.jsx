import { createContext, useContext, useState, useEffect } from "react"

// axios instance ve interceptor token setter
import api, { setAxiosToken } from "../api/axios"

const AuthContext = createContext()

export function AuthProvider({ children }) {

  //Kullanıcı bilgisi
  const [user, setUser] = useState(null)

  // Access token (React state)
  const [accessToken, setAccessTokenState] = useState(null)

  // Auth kontrol edilirken loading state
  const [loading, setLoading] = useState(true)


  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    })

    const token = res.data.data.accessToken

    // React state'e koyuyoruz
    setAccessTokenState(token)

    // Axios interceptor'a veriyoruz
    setAxiosToken(token)

    setUser(res.data.data.user)
  }


  //SAYFA AÇILDIĞINDA REFRESH TOKEN KONTROLÜ
  useEffect(() => {

    const refreshUser = async () => {
      try {
        const res = await api.post("/auth/refresh")

        const token = res.data.data.accessToken

        // Token varsa tekrar set et
        setAccessTokenState(token)
        setAxiosToken(token)

        setUser(res.data.data.user)
      } catch (err) {
        console.log("Refresh token yok veya geçersiz")
      } finally {
        // Auth kontrolü bitti
        setLoading(false)
      }
    }

    refreshUser()

  }, []) //Dependency array boş olmalı


  //LOGOUT
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
        loading, // ProtectedRoute için gerekli
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
