import axios from "axios";
import { toast } from "sonner";

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
            const hadToken = !!localStorage.getItem("token");

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            // TAMPILKAN NOTIF CUMA KALAU SEBELUMNYA MEMANG PUNYA SESI AKTIF
            if (hadToken) {
                toast.error("Sesi Anda berakhir", {
                    description:
                        "Akun Anda sedang digunakan / login di perangkat lain.",
                });
            }

            // KASIH JEDA DIKIT BIAR TOAST SEMPAT KELIATAN SEBELUM REDIRECT
            setTimeout(() => {
                window.location.href = "/";
            }, 1200);

            return Promise.reject(error);
        }

        return Promise.reject(error);
    },
);

export default api;