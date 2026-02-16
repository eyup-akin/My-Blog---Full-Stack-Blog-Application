import axios from "axios"

let accessToken = null


//axios interceptor iÃ§in token setter
export const setAxiosToken = (token) => {
    accessToken = token
}


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})


api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


export default api