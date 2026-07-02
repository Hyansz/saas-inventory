"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import {
    LayoutDashboard,
    ArrowDownToLine,
    ArrowUpFromLine,
    History,
    Package,
    ClipboardCheck,
    FolderTree,
    FileSpreadsheet,
    X,
    Sparkles,
    ChevronRight,
} from "lucide-react";

interface SidebarProps {
    mobileOpen?: boolean;
    setMobileOpen?: (value: boolean) => void;
    mobileOnly?: boolean;
}

const allMenus = [
    {
        title: "OVERVIEW",
        menus: [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
                roles: ["admin", "manager"],
            },
        ],
    },

    {
        title: "AKTIVITAS",
        menus: [
            {
                name: "Barang Masuk",
                href: "/stock-ins",
                icon: ArrowDownToLine,
                roles: ["admin"],
            },
            {
                name: "Barang Keluar",
                href: "/stock-outs",
                icon: ArrowUpFromLine,
                roles: ["admin"],
            },
            {
                name: "Riwayat Transaksi",
                href: "/transactions",
                icon: History,
                roles: ["admin", "manager"],
            },
        ],
    },

    {
        title: "INVENTORY",
        menus: [
            {
                name: "Data Barang",
                href: "/items",
                icon: Package,
                roles: ["admin", "manager"],
            },
            {
                name: "Stock Monitoring",
                href: "/stock-monitoring",
                icon: ClipboardCheck,
                roles: ["admin", "manager"],
            },
            {
                name: "Kategori",
                href: "/categories",
                icon: FolderTree,
                roles: ["admin"],
            },
        ],
    },

    {
        title: "LAPORAN",
        menus: [
            {
                name: "Laporan",
                href: "/reports",
                icon: FileSpreadsheet,
                roles: ["admin", "manager"],
            },
        ],
    },
];

export default function Sidebar({
    mobileOpen,
    setMobileOpen,
    mobileOnly = false,
}: SidebarProps) {
    const pathname = usePathname();

    const user = useAuthStore((state) => state.user);

    const role = user?.role;

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [mobileOpen]);

    if (!role) return null;

    return (
        <>
            {/* MOBILE OVERLAY */}
            {mobileOnly && mobileOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        backdrop-blur-sm
                        lg:hidden
                    "
                    onClick={() => setMobileOpen?.(false)}
                />
            )}

            <motion.aside
                initial={!mobileOnly ? { x: -60, opacity: 0 } : false}
                animate={!mobileOnly ? { x: 0, opacity: 1 } : {}}
                transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                    h-screen
                    w-[290px]
                    overflow-y-auto
                    border-r
                    border-zinc-200/70
                    bg-white/80
                    backdrop-blur-2xl
                    flex-shrink-0

                    dark:border-zinc-800
                    dark:bg-[#09090b]/95

                    ${
                        mobileOnly
                            ? `
                                fixed
                                top-0
                                left-0
                                z-50
                                transition-transform
                                duration-300
                                lg:hidden
                                ${
                                    mobileOpen
                                        ? "translate-x-0"
                                        : "-translate-x-full"
                                }
                            `
                            : `
                                hidden
                                sticky
                                top-0
                                lg:flex
                            `
                    }
                `}
            >
                <div className="flex min-h-full w-full flex-col px-5 py-5">
                    {/* HEADER */}
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-black
                                        text-white
                                        shadow-lg
                                    "
                                >
                                    <Sparkles size={18} />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            text-xl
                                            font-semibold
                                            tracking-tight
                                        "
                                    >
                                        Inventory
                                    </h1>

                                    <p className="text-xs text-zinc-500">
                                        SaaS Management
                                    </p>
                                </div>
                            </div>
                        </div>

                        {mobileOnly && (
                            <button
                                onClick={() => setMobileOpen?.(false)}
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    transition
                                    hover:bg-zinc-100
                                    dark:hover:bg-zinc-900
                                    cursor-pointer
                                "
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* MENUS */}
                    <div className="space-y-8">
                        {allMenus.map((group) => {
                            const menus = group.menus.filter((menu) =>
                                menu.roles.includes(role),
                            );

                            if (!menus.length) return null;

                            return (
                                <div key={group.title}>
                                    <p
                                        className="
                                            mb-3
                                            px-3
                                            text-[11px]
                                            font-semibold
                                            tracking-[0.18em]
                                            text-zinc-400
                                        "
                                    >
                                        {group.title}
                                    </p>

                                    <nav className="space-y-1.5">
                                        {menus.map((menu) => {
                                            const Icon = menu.icon;

                                            const active =
                                                pathname === menu.href;

                                            return (
                                                <Link
                                                    key={menu.name}
                                                    href={menu.href}
                                                    onClick={() =>
                                                        setMobileOpen?.(false)
                                                    }
                                                    className={`
                                                        group
                                                        relative
                                                        flex
                                                        items-center
                                                        justify-between
                                                        rounded-2xl
                                                        px-4
                                                        py-3
                                                        text-sm
                                                        font-medium
                                                        transition-all
                                                        duration-200

                                                        ${
                                                            active
                                                                ? `
                                                                    bg-black
                                                                    text-white
                                                                    shadow-[0_15px_45px_rgba(0,0,0,0.18)]
                                                                `
                                                                : `
                                                                    text-zinc-700
                                                                    hover:bg-zinc-100
                                                                    dark:text-zinc-300
                                                                    dark:hover:bg-zinc-900
                                                                `
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-xl
                                                                transition-all
                                                                ${
                                                                    active
                                                                        ? `
                                                                            bg-white/10
                                                                            text-white
                                                                        `
                                                                        : `
                                                                            bg-zinc-100
                                                                            text-zinc-600
                                                                            group-hover:bg-white
                                                                            dark:bg-zinc-800
                                                                            dark:text-zinc-300
                                                                        `
                                                                }
                                                            `}
                                                        >
                                                            <Icon size={17} />
                                                        </div>

                                                        <span>{menu.name}</span>
                                                    </div>

                                                    <ChevronRight
                                                        size={15}
                                                        className={`
                                                            transition-all
                                                            ${
                                                                active
                                                                    ? `
                                                                        opacity-100
                                                                        translate-x-0
                                                                    `
                                                                    : `
                                                                        opacity-0
                                                                        -translate-x-1
                                                                        group-hover:opacity-100
                                                                        group-hover:translate-x-0
                                                                    `
                                                            }
                                                        `}
                                                    />
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            );
                        })}
                    </div>

                    {/* FOOTER */}
                    <div className="mt-auto py-10">
                        <div
                            className="
                                overflow-hidden
                                rounded-[1.75rem]
                                border
                                border-zinc-200
                                bg-gradient-to-br
                                from-zinc-50
                                to-white
                                p-5
                                dark:border-zinc-800
                                dark:from-zinc-900
                                dark:to-zinc-950
                            "
                        >
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
                                    "
                                >
                                    <Sparkles size={16} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Inventory v1.0
                                    </p>

                                    <p className="text-xs text-zinc-500 mt-1">
                                        Modern SaaS Dashboard
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
