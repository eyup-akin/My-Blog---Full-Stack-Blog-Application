import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ProtectedRoute from "./routes/ProtectedRoute"
import Dashboard from "./pages/Dashboard"



function App() {
  return (
    <Routes>
      <Route path="/" element = {<Home />} />
      <Route path="/login" element = {<Login />} />

      <Route 
        path = "/dashboard"
        element = {
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App
