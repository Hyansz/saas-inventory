import axios from "axios";
import api from "@/lib/axios";

export async function csrf() {
    await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
    });
}

export async function login(data: any) {
    console.log("API =", process.env.NEXT_PUBLIC_API_URL);
    
    await csrf();

    const res = await api.post("/login", data);
    

    return res.data;
}

export async function me() {
    const res = await api.get("/me");

    return res.data;
}

export async function logout() {
    const res = await api.post("/logout");

    return res.data;
}
