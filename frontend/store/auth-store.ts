import { create } from "zustand";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;

    hydrated: boolean;

    setUser: (user: User) => void;

    logout: () => void;

    hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,

    hydrated: false,

    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));

        set({
            user,
        });
    },

    logout: () => {
        localStorage.removeItem("user");

        set({
            user: null,
        });
    },

    hydrate: () => {
        const user = localStorage.getItem("user");

        set({
            user: user ? JSON.parse(user) : null,
            hydrated: true,
        });
    },
}));
