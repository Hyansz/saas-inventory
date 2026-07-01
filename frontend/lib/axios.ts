import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,

    withCredentials: true,

    withXSRFToken: true,

    xsrfCookieName: "XSRF-TOKEN",

    xsrfHeaderName: "X-XSRF-TOKEN",

    headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        // URL REQUEST SEKARANG
        const requestUrl = error.config?.url || "";

        /**
         * JANGAN REDIRECT SAAT LOGIN GAGAL
         * karena login memang return 401 kalau email/password salah
         */
        const isLoginRequest = requestUrl.includes("/login");

        if (
            error.response?.status === 401 &&
            !isLoginRequest
        ) {
            localStorage.removeItem("user");

            window.location.href = "/";
        }

        return Promise.reject(error);
    },
);

export default api;