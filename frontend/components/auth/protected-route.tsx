"use client";

import { useRouter, usePathname } from "next/navigation";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";

// HALAMAN YANG CUMA BOLEH DIAKSES SUPER_ADMIN
const superAdminOnlyRoutes = ["/users", "/sessions"];

// HALAMAN YANG DILARANG BUAT MANAGER
const managerForbiddenRoutes = ["/categories", "/stock-ins", "/stock-outs"];

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

        // GUARD: HALAMAN KHUSUS SUPER_ADMIN
        if (
            superAdminOnlyRoutes.includes(pathname) &&
            user.role !== "super_admin"
        ) {
            router.replace("/dashboard");
            return;
        }

        // GUARD: HALAMAN YANG DILARANG BUAT MANAGER
        if (
            user.role === "manager" &&
            managerForbiddenRoutes.includes(pathname)
        ) {
            router.replace("/dashboard");
            return;
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
