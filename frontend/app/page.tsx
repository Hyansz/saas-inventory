"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Eye, EyeOff, Loader2, User } from "lucide-react";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

export default function HomePage() {
    const router = useRouter();

    const setAuth = useAuthStore((state) => state.setAuth);

    const user = useAuthStore((state) => state.user);

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            router.replace("/dashboard");
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await login({
                username,
                password,
            });

            setAuth(response.user, response.token);

            router.replace("/dashboard");
        } catch (error: any) {
            setError(
                error.response?.data?.message ?? "Username atau password salah",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="
                min-h-screen
                bg-zinc-50
                flex
                items-center
                justify-center
                p-4
            "
        >
            <div
                className="
                    w-full
                    max-w-sm
                    bg-white
                    border
                    rounded-3xl
                    p-8
                    shadow-sm
                "
            >
                {/* HEADER */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Inventory System
                    </h1>

                    <p className="text-sm text-zinc-500 mt-2">
                        Login untuk melanjutkan ke dashboard inventory.
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div
                        className="
                            mb-5
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-600
                        "
                    >
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* username */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                            />

                            <input
                                type="text"
                                placeholder="username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (error) {
                                        setError("");
                                    }
                                }}
                                className="
                                    w-full
                                    h-12
                                    mt-1
                                    rounded-2xl
                                    border
                                    bg-zinc-50
                                    pl-11
                                    pr-4
                                    text-sm
                                    outline-none
                                    focus:ring-2
                                    focus:ring-black
                                "
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>

                        <div className="relative">
                            <LockKeyhole
                                size={18}
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-zinc-400
                                "
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);

                                    // ERROR HILANG SAAT USER NGETIK ULANG
                                    if (error) {
                                        setError("");
                                    }
                                }}
                                className="
                                    w-full
                                    h-12
                                    mt-1
                                    rounded-2xl
                                    border
                                    bg-zinc-50
                                    pl-11
                                    pr-11
                                    text-sm
                                    outline-none
                                    focus:ring-2
                                    focus:ring-black
                                "
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-zinc-400
                                    hover:text-zinc-700
                                    transition
                                "
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <button
                        disabled={loading}
                        className="
                            w-full
                            h-12
                            rounded-2xl
                            bg-black
                            text-white
                            font-semibold
                            hover:opacity-90
                            transition
                            disabled:opacity-50
                            flex
                            items-center
                            justify-center
                            gap-2
                            cursor-pointer
                        "
                    >
                        {loading && (
                            <Loader2 size={18} className="animate-spin" />
                        )}

                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>

                {/* FOOTER */}
                <div className="mt-8 pt-6 border-t">
                    <p className="text-xs text-zinc-500 text-center">
                        Secure Inventory Management System
                    </p>
                </div>
            </div>
        </main>
    );
}
