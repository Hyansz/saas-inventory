"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import {
    AlertOctagon,
    BadgeCheck,
    Bell,
    Info,
    TriangleAlert,
    X,
} from "lucide-react";
import { getAnalytics } from "@/services/analytics";

const variants = {
    danger: {
        icon: AlertOctagon,
        iconColor: "text-red-600",
        bg: "bg-red-50",
        badge: "bg-red-100 text-red-700 border-red-200",
        label: "Critical",
    },

    warning: {
        icon: TriangleAlert,
        iconColor: "text-amber-600",
        bg: "bg-amber-50",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        label: "Warning",
    },

    success: {
        icon: BadgeCheck,
        iconColor: "text-emerald-600",
        bg: "bg-emerald-50",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        label: "Success",
    },

    info: {
        icon: Info,
        iconColor: "text-blue-600",
        bg: "bg-blue-50",
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Info",
    },
};

export default function Notification() {
    const [open, setOpen] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);

    const { data: analytics, isLoading } = useQuery({
        queryKey: ["analytics"],
        queryFn: getAnalytics,
        staleTime: 1000 * 60 * 2,
    });

    const alerts = analytics?.alerts ?? [];

    const hasAlert = alerts.length > 0;

    const isMobile = useMemo(() => {
        if (typeof window === "undefined") return false;

        return window.innerWidth < 768;
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                notifRef.current &&
                !notifRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }

        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);

            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    useEffect(() => {
        if (!isMobile) return;

        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open, isMobile]);

    const renderAlert = (alert: any, index: number) => {
        const style =
            variants[alert.type as keyof typeof variants] ?? variants.info;

        const Icon = style.icon;

        return (
            <motion.div
                key={index}
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    y: -10,
                }}
                transition={{
                    duration: 0.25,
                }}
                className="
                    group
                    rounded-2xl
                    border
                    border-zinc-100
                    bg-white
                    p-4
                    transition-all
                    hover:border-zinc-200
                    hover:bg-zinc-50
                "
            >
                <div className="flex gap-3">
                    <div
                        className={`
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            ${style.bg}
                        `}
                    >
                        <Icon size={18} className={style.iconColor} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                            <span
                                className={`
                                    rounded-full
                                    border
                                    px-2.5
                                    py-1
                                    text-[11px]
                                    font-medium
                                    ${style.badge}
                                `}
                            >
                                {style.label}
                            </span>

                            <span className="text-[11px] text-zinc-400">
                                Baru saja
                            </span>
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                            {alert.message}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div ref={notifRef} className="relative">
            {/* BUTTON */}

            <button
                onClick={() => setOpen((v) => !v)}
                className="
                    relative
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-zinc-200
                    bg-white
                    transition-all
                    hover:border-zinc-300
                    hover:bg-zinc-50
                    cursor-pointer
                "
            >
                <Bell size={18} />

                {hasAlert && (
                    <>
                        <span
                            className="
                                absolute
                                right-2.5
                                top-2.5
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-red-500
                            "
                        />

                        <span
                            className="
                                absolute
                                right-2.5
                                top-2.5
                                h-2.5
                                w-2.5
                                animate-ping
                                rounded-full
                                bg-red-500
                            "
                        />
                    </>
                )}
            </button>

            {/* ================= DESKTOP DROPDOWN ================= */}

            <AnimatePresence>
                {open && !isMobile && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -10,
                            scale: 0.96,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: -10,
                            scale: 0.96,
                        }}
                        transition={{
                            duration: 0.22,
                        }}
                        className="
                            absolute
                            right-0
                            mt-3
                            z-50
                            w-[390px]
                            overflow-hidden
                            rounded-3xl
                            border
                            border-zinc-200/80
                            bg-white/98
                            backdrop-blur-xl
                            shadow-[0_25px_80px_rgba(0,0,0,.18)]
                        "
                    >
                        {/* HEADER */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-zinc-100
                                px-5
                                py-4
                            "
                        >
                            <div>
                                <h3 className="font-semibold text-zinc-900">
                                    Notifikasi
                                </h3>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Monitoring inventory realtime
                                </p>
                            </div>

                            <div
                                className="
                                    flex
                                    h-8
                                    min-w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-zinc-900
                                    px-2.5
                                    text-xs
                                    font-semibold
                                    text-white
                                "
                            >
                                {alerts.length}
                            </div>
                        </div>

                        {/* CONTENT */}

                        <div className="max-h-[450px] overflow-y-auto">
                            {isLoading ? (
                                <div className="space-y-3 p-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="
                                                animate-pulse
                                                rounded-2xl
                                                border
                                                border-zinc-100
                                                p-4
                                            "
                                        >
                                            <div className="mb-3 h-3 w-24 rounded bg-zinc-200" />

                                            <div className="mb-2 h-3 w-full rounded bg-zinc-200" />

                                            <div className="h-3 w-2/3 rounded bg-zinc-100" />
                                        </div>
                                    ))}
                                </div>
                            ) : alerts.length ? (
                                <div className="space-y-2 p-3">
                                    {alerts.map(renderAlert)}
                                </div>
                            ) : (
                                <div className="px-6 py-14 text-center">
                                    <div
                                        className="
                                            mx-auto
                                            mb-4
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-zinc-100
                                        "
                                    >
                                        <Bell
                                            size={22}
                                            className="text-zinc-400"
                                        />
                                    </div>

                                    <h4 className="font-medium text-zinc-900">
                                        Tidak ada notifikasi
                                    </h4>

                                    <p className="mt-2 text-sm text-zinc-500">
                                        Semua inventory dalam kondisi normal.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}

                        {alerts.length > 0 && (
                            <div
                                className="
                                    border-t
                                    border-zinc-100
                                    bg-zinc-50
                                    p-3
                                "
                            >
                                <button
                                    className="
                                        h-10
                                        w-full
                                        rounded-xl
                                        bg-white
                                        text-sm
                                        font-medium
                                        text-zinc-700
                                        transition
                                        hover:bg-zinc-100
                                    "
                                >
                                    Lihat Semua Aktivitas
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= MOBILE BOTTOM SHEET ================= */}
            {typeof window !== "undefined" &&
                createPortal(
                        <AnimatePresence>
                            {open && isMobile && (
                                <>
                                    {/* BACKDROP */}

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => setOpen(false)}
                                        className="
                                    fixed
                                    inset-0
                                    z-[9998]
                                    bg-black/40
                                    backdrop-blur-sm
                                "
                                    />

                                    {/* SHEET */}

                                    <motion.div
                                        initial={{
                                            y: "100%",
                                        }}
                                        animate={{
                                            y: 0,
                                        }}
                                        exit={{
                                            y: "100%",
                                        }}
                                        transition={{
                                            duration: 0.28,
                                        }}
                                        className="
                                    fixed
                                    bottom-0
                                    left-0
                                    right-0
                                    z-[9999]
                                    h-[78vh]
                                    rounded-t-[32px]
                                    bg-white
                                    shadow-[0_-10px_60px_rgba(0,0,0,.18)]
                                    flex
                                    flex-col
                                "
                                    >
                                        {/* HANDLE */}

                                        <div className="flex justify-center py-3">
                                            <div
                                                className="
                                            h-1.5
                                            w-14
                                            rounded-full
                                            bg-zinc-300
                                        "
                                            />
                                        </div>

                                        {/* HEADER */}

                                        <div
                                            className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-zinc-100
                                        px-5
                                        pb-4
                                    "
                                        >
                                            <div>
                                                <h3 className="font-semibold text-zinc-900">
                                                    Notifikasi
                                                </h3>

                                                <p className="mt-1 text-xs text-zinc-500">
                                                    Monitoring inventory realtime
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="
                                                flex
                                                h-8
                                                min-w-8
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-zinc-900
                                                px-2
                                                text-xs
                                                font-semibold
                                                text-white
                                            "
                                                >
                                                    {alerts.length}
                                                </div>

                                                <button
                                                    onClick={() => setOpen(false)}
                                                    className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-zinc-200
                                            "
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* CONTENT */}

                                        <div
                                            className="
                                        flex-1
                                        overflow-y-auto
                                        p-4
                                        space-y-3
                                    "
                                        >
                                            {isLoading ? (
                                                [...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="
                                                    animate-pulse
                                                    rounded-2xl
                                                    border
                                                    border-zinc-100
                                                    p-4
                                                "
                                                    >
                                                        <div className="mb-3 h-3 w-24 rounded bg-zinc-200" />

                                                        <div className="mb-2 h-3 w-full rounded bg-zinc-200" />

                                                        <div className="h-3 w-2/3 rounded bg-zinc-100" />
                                                    </div>
                                                ))
                                            ) : alerts.length ? (
                                                alerts.map(renderAlert)
                                            ) : (
                                                <div
                                                    className="
                                                flex
                                                h-full
                                                flex-col
                                                items-center
                                                justify-center
                                                text-center
                                            "
                                                >
                                                    <div
                                                        className="
                                                    mb-5
                                                    flex
                                                    h-16
                                                    w-16
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    bg-zinc-100
                                                "
                                                    >
                                                        <Bell
                                                            size={26}
                                                            className="text-zinc-400"
                                                        />
                                                    </div>

                                                    <h4 className="font-semibold">
                                                        Tidak ada notifikasi
                                                    </h4>

                                                    <p className="mt-2 max-w-xs text-sm text-zinc-500">
                                                        Semua inventory berada dalam
                                                        kondisi aman.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* FOOTER */}

                                        {alerts.length > 0 && (
                                            <div
                                                className="
                                            border-t
                                            border-zinc-100
                                            p-4
                                        "
                                            >
                                                <button
                                                    className="
                                                h-12
                                                w-full
                                                rounded-2xl
                                                bg-zinc-900
                                                text-sm
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-black
                                            "
                                                >
                                                    Lihat Semua Aktivitas
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>,
                        document.body
                )}
        </div>
    );
}
