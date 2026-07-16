"use client";

import { motion } from "framer-motion";
import { Wifi, ShieldCheck, Search, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    getActiveSessions,
    forceLogoutToken,
    type ActiveSession,
} from "@/services/sessions";

import TablePagination from "@/components/ui/table-paginaton";
import SessionsTable from "@/components/sessions/sessions-table";

const ITEMS_PER_PAGE = 10;

export default function SessionsPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const queryClient = useQueryClient();

    const { data = [], isLoading } = useQuery({
        queryKey: ["active-sessions"],

        queryFn: async () => {
            return await getActiveSessions();
        },

        refetchInterval: 3000,
    });

    const filteredData = useMemo(() => {
        return data.filter((item: ActiveSession) => {
            const keyword = search.toLowerCase();

            return (
                item.name?.toLowerCase().includes(keyword) ||
                item.username?.toLowerCase().includes(keyword) ||
                item.email?.toLowerCase().includes(keyword)
            );
        });
    }, [data, search]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;

        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, page]);

    const today = new Date().toISOString().split("T")[0];

    const loginToday = data.filter((item: ActiveSession) => {
        if (!item.logged_in_at) return false;

        const date = new Date(item.logged_in_at).toISOString().split("T")[0];

        return date === today;
    }).length;

    const totalSuperAdmin = data.filter(
        (u: ActiveSession) => u.role === "super_admin",
    ).length;

    const totalStaff = data.filter(
        (u: ActiveSession) => u.role !== "super_admin",
    ).length;

    const handleForceLogout = async (session: ActiveSession) => {
        const deviceLabel = `${session.browser} (${session.os})`;

        const confirmed = confirm(
            `Logout paksa sesi ${session.name} di ${deviceLabel}?\nIP: ${session.ip_address}\nLokasi: ${session.location || '-'}`,
        );

        if (!confirmed) return;

        try {
            setProcessingId(session.token_id);

            await forceLogoutToken(session.token_id);

            toast.success(`Sesi ${session.name} di ${deviceLabel} berhasil dilogout`);

            queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ?? "Gagal logout sesi ini",
            );
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-72 rounded-[32px] bg-zinc-100" />

                <div className="h-[500px] rounded-[32px] bg-zinc-100" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* HERO */}
            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="
                    relative
                    overflow-hidden
                    rounded-[2.5rem]
                    border
                    border-white/10
                    bg-gradient-to-br
                    from-zinc-950
                    via-zinc-900
                    to-black
                    p-6
                    md:p-8
                    text-white
                    shadow-2xl
                "
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

                <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative z-10">
                    {/* TOP */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-white/10
                                bg-white/10
                                px-4
                                py-2
                                text-xs
                                font-medium
                                backdrop-blur-xl
                            "
                        >
                            <Wifi size={14} />
                            Live Monitoring
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="mt-10 flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-3xl">
                            <h1
                                className="
                                    text-4xl
                                    md:text-6xl
                                    font-semibold
                                    tracking-tight
                                    leading-none
                                "
                            >
                                Sesi Aktif
                            </h1>

                            <p
                                className="
                                    mt-5
                                    max-w-2xl
                                    text-sm
                                    md:text-base
                                    leading-relaxed
                                    text-zinc-300
                                "
                            >
                                Pantau seluruh akun yang sedang online dan
                                logout paksa perangkat yang stuck atau tidak
                                dikenali secara realtime.
                            </p>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="mt-10 grid grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Sesi Aktif"
                            value={data.length}
                            icon={<Wifi size={18} />}
                            positive
                        />

                        <StatCard
                            title="Login Hari Ini"
                            value={loginToday}
                            icon={<Clock size={18} />}
                        />

                        <StatCard
                            title="Super Admin Online"
                            value={totalSuperAdmin}
                            icon={<ShieldCheck size={18} />}
                        />

                        <StatCard
                            title="Staff Online"
                            value={totalStaff}
                            icon={<Wifi size={18} />}
                        />
                    </div>
                </div>
            </motion.section>

            {/* SEARCH */}
            <div
                className="
                    rounded-[28px]
                    border
                    border-zinc-200
                    bg-white
                    p-4
                "
            >
                <div className="relative">
                    <Search
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
                        placeholder="Cari nama, username, atau email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="
                            w-full
                            h-12
                            rounded-2xl
                            border
                            border-zinc-200
                            bg-zinc-50
                            pl-11
                            pr-4
                            text-sm
                            focus:outline-none
                            focus:ring-4
                            focus:ring-zinc-200
                        "
                    />
                </div>
            </div>

            {/* TABLE / CARDS */}
            <SessionsTable
                data={paginatedData}
                processingId={processingId}
                onForceLogout={handleForceLogout}
            />

            {/* PAGINATION */}
            <TablePagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />
        </div>
    );
}

function StatCard({ title, value, icon, positive }: any) {
    return (
        <div
            className="
                rounded-3xl
                border
                border-white/10
                bg-white/[0.03]
                p-5
            "
        >
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">{title}</p>

                <div className="text-zinc-500">{icon}</div>
            </div>

            <h3 className="mt-4 text-3xl font-bold">{value}</h3>
        </div>
    );
}
