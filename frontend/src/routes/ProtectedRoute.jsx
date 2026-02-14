import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


function ProtectedRoute({ children }) {
    const { accessToken, loading } = useAuth()

    //refresh kontrolu birmeden yönlendirme yapma
    if (loading) {
        return <div>Yükleniyor...</div>
    }

    if (!accessToken) {
        return <Navigate to = "/login" replace />
    }

    return children

}

export default ProtectedRoute

