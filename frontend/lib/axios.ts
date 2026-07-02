import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,

    headers: {
        Accept: "application/json",
    },
});

// SISIPKAN TOKEN DI SETIAP REQUEST
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        // URL REQUEST SEKARANG
        const requestUrl = error.config?.url || "";

        const isLoginRequest = requestUrl.includes("/login");

        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            window.location.href = "/";
        }

        return Promise.reject(error);
    },
);

export default api;
