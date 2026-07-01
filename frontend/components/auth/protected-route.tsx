"use client";

import { useRouter, usePathname } from "next/navigation";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const pathname = usePathname();

    const user = useAuthStore((state) => state.user);

    const hydrated = useAuthStore((state) => state.hydrated);

    useEffect(() => {
        if (!hydrated) return;

        if (!user) {
            router.replace("/");
            return;
        }

        if (user.role === "manager") {
            const forbiddenRoutes = [
                "/categories",
                "/stock-ins",
                "/stock-outs",
            ];

            if (forbiddenRoutes.includes(pathname)) {
                router.replace("/dashboard");
            }
        }
    }, [pathname, router, user, hydrated]);

    if (!hydrated) {
        return <div className="min-h-screen bg-zinc-50" />;
    }

    if (!user) {
        return null;
    }

    return children;
}
