import { useState } from "react"
import { useAuth } from "../context/AuthContext"


function Login() {

    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await login(email, password)
            alert("Giriş başarılı")
        } catch (err) {
            console.error(err)
            alert("Giriş başarısız")
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow w-96"
            >
                <h2 className="text-2xl font-bold mb-6">Giriş Yap</h2>

                 <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Şifre"
                    className="w-full border p-2 mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                
                />

                <button type="submit" className="w-full bg-black text-white p-2">
                Giriş Yap
                </button>

            </form>
        </div>
    )

}

export default Login