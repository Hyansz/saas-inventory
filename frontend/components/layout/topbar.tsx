"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ChevronDown,
    LayoutGrid,
    LogOut,
    Menu,
    TriangleAlert,
    X,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./sidebar";
import Notification from "./notification";

const routeNames: Record<string, string> = {
    dashboard: "Dashboard",
    items: "Data Barang",
    "stock-ins": "Barang Masuk",
    "stock-outs": "Barang Keluar",
    transactions: "Riwayat Transaksi",
    reports: "Laporan",
    categories: "Kategori",
    "stock-monitoring": "Stock Monitoring",
};

export default function Topbar() {
    const router = useRouter();

    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);

    const [logoutOpen, setLogoutOpen] = useState(false);

    const [loadingLogout, setLoadingLogout] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = useAuthStore((state) => state.user);

    const logoutStore = useAuthStore((state) => state.logout);

    /*
    |--------------------------------------------------------------------------
    | BREADCRUMB
    |--------------------------------------------------------------------------
    */

    const breadcrumbs = useMemo(() => {
        const paths = pathname.split("/").filter(Boolean);

        return paths.map((path, index) => ({
            name: routeNames[path] || path,
            href: "/" + paths.slice(0, index + 1).join("/"),
        }));
    }, [pathname]);

    /*
    |--------------------------------------------------------------------------
    | CLOSE DROPDOWN
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | BODY LOCK
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (logoutOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [logoutOpen]);

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const handleLogout = async () => {
        try {
            setLoadingLogout(true);

            await api.post("/logout");
        } catch (error) {
            console.log(error);
        } finally {
            logoutStore();

            router.push("/");
        }
    };

    return (
        <>
            {/* MOBILE SIDEBAR */}
            <Sidebar
                mobileOnly
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* TOPBAR */}
            <motion.header
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="
                    sticky
                    top-0
                    z-40
                    border-b
                    border-zinc-200/70
                    bg-white/80
                    backdrop-blur-2xl
                "
            >
                <div
                    className="
                        flex
                        h-20
                        items-center
                        justify-between
                        gap-4
                        px-4
                        md:px-6
                    "
                >
                    {/* LEFT */}
                    <div className="flex min-w-0 items-center gap-4">
                        {/* MOBILE MENU */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-zinc-200
                                bg-white
                                transition
                                hover:bg-zinc-50
                                lg:hidden
                                cursor-pointer
                            "
                        >
                            <Menu size={20} />
                        </button>

                        {/* BREADCRUMB */}
                        <div className="hidden md:block">
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-black
                                        text-white
                                        shadow-sm
                                    "
                                >
                                    <LayoutGrid size={17} />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        {breadcrumbs.map((item, index) => (
                                            <div
                                                key={item.href}
                                                className="flex items-center gap-2"
                                            >
                                                {index !== 0 && (
                                                    <span className="text-zinc-300">
                                                        /
                                                    </span>
                                                )}

                                                <Link
                                                    href={item.href}
                                                    className={`
                                                        transition
                                                        ${
                                                            index ===
                                                            breadcrumbs.length -
                                                                1
                                                                ? "font-semibold text-black"
                                                                : "text-zinc-500 hover:text-black"
                                                        }
                                                    `}
                                                >
                                                    {item.name}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="mt-0.5 text-xs text-zinc-500">
                                        SaaS Inventory Platform
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                        <Notification />

                        {/* PROFILE */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-2xl
                                    lg:border
                                    border-zinc-200
                                    bg-white
                                    px-3
                                    py-2
                                    transition
                                    hover:bg-zinc-50
                                    cursor-pointer
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-black
                                        text-sm
                                        font-semibold
                                        uppercase
                                        text-white
                                    "
                                >
                                    {user?.name?.charAt(0)}
                                </div>

                                <div className="hidden text-left md:block">
                                    <p className="text-sm font-semibold leading-none">
                                        {user?.name}
                                    </p>

                                    <p className="mt-1 text-xs text-zinc-500">
                                        {user?.role === "admin"
                                            ? "Administrator"
                                            : "Manager"}
                                    </p>
                                </div>

                                <ChevronDown
                                    size={16}
                                    className={`
                                        hidden
                                        transition
                                        md:block
                                        ${profileOpen ? "rotate-180" : ""}
                                    `}
                                />
                            </button>

                            {/* DROPDOWN */}
                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -16,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -12,
                                        }}
                                        transition={{
                                            duration: 0.22,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className="
                                            absolute
                                            right-0
                                            top-[calc(100%+12px)]
                                            z-50
                                            w-72
                                            overflow-hidden
                                            rounded-3xl
                                            border
                                            border-zinc-200
                                            bg-white
                                            shadow-[0_20px_60px_rgba(0,0,0,.15)]
                                        "
                                    >
                                        <div className="border-b p-5">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="
                                                    flex
                                                    h-14
                                                    w-14
                                                    items-center
                                                    justify-center
                                                    rounded-3xl
                                                    bg-black
                                                    text-lg
                                                    font-semibold
                                                    uppercase
                                                    text-white
                                                "
                                                >
                                                    {user?.name?.charAt(0)}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold">
                                                        {user?.name}
                                                    </p>

                                                    <p className="mt-1 truncate text-sm text-zinc-500">
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3">
                                            <button
                                                onClick={() => {
                                                    setProfileOpen(false);

                                                    setLogoutOpen(true);
                                                }}
                                                className="
                                                flex
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                px-4
                                                py-3
                                                text-sm
                                                font-medium
                                                text-red-600
                                                transition
                                                hover:bg-red-50
                                                cursor-pointer
                                            "
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* LOGOUT MODAL */}
            {logoutOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        p-4
                        backdrop-blur-sm
                    "
                >
                    <div
                        className="
                            relative
                            w-full
                            max-w-md
                            overflow-hidden
                            rounded-[2rem]
                            border
                            border-zinc-200
                            bg-white
                            p-7
                            shadow-2xl
                        "
                    >
                        <div className="relative z-10">
                            <div
                                className="
                                    mb-6
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-3xl
                                    bg-red-100
                                    text-red-600
                                "
                            >
                                <TriangleAlert size={30} />
                            </div>

                            <h2 className="text-3xl font-semibold tracking-tight">
                                Logout Account
                            </h2>

                            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                                Anda yakin ingin logout dari dashboard? Anda
                                perlu login kembali untuk mengakses sistem
                                inventory.
                            </p>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => setLogoutOpen(false)}
                                    className="
                                        h-12
                                        flex-1
                                        rounded-2xl
                                        border
                                        border-zinc-200
                                        font-medium
                                        transition
                                        hover:bg-zinc-50
                                        cursor-pointer
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleLogout}
                                    disabled={loadingLogout}
                                    className="
                                        h-12
                                        flex-1
                                        rounded-2xl
                                        bg-red-600
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-red-700
                                        disabled:opacity-50
                                        cursor-pointer
                                    "
                                >
                                    {loadingLogout
                                        ? "Logging out..."
                                        : "Logout"}
                                </button>
                            </div>
                        </div>

                        {/* BG */}
                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-100 opacity-60 blur-3xl pointer-events-none" />

                        {/* CLOSE */}
                        <button
                            onClick={() => setLogoutOpen(false)}
                            className="
                                absolute
                                right-5
                                top-5
                                z-20
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                transition-all
                                hover:border
                                hover:border-black/20
                                cursor-pointer
                                duration-200
                            "
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
