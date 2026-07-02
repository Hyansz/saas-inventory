import { create } from "zustand";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;

    token: string | null;

    hydrated: boolean;

    setAuth: (user: User, token: string) => void;

    logout: () => void;

    hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,

    token: null,

    hydrated: false,

    setAuth: (user, token) => {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        set({
            user,
            token,
        });
    },

    logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        set({
            user: null,
            token: null,
        });
    },

    hydrate: () => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        set({
            user: user ? JSON.parse(user) : null,
            token: token ?? null,
            hydrated: true,
        });
    },
}));
