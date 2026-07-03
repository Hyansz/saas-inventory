"use client";

import { motion } from "framer-motion";
import { Wifi, ShieldCheck, Search, LogOut, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    getActiveSessions,
    forceLogout,
    type ActiveSession,
} from "@/services/sessions";

import TablePagination from "@/components/ui/table-paginaton";

const ITEMS_PER_PAGE = 10;

const roleLabel: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    manager: "Manager",
};

const roleBadge: Record<string, string> = {
    super_admin: "bg-purple-500/15 text-purple-500 border-purple-500/80",
    admin: "bg-blue-500/15 text-blue-500 border-blue-500/80",
    manager: "bg-zinc-500/15 text-zinc-500 border-zinc-500/80",
};

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

        staleTime: 1000 * 30,
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
        const confirmed = confirm(
            `Logout paksa akun "${session.name}"? User tersebut akan langsung ter-logout dari device-nya.`,
        );

        if (!confirmed) return;

        try {
            setProcessingId(session.id);

            await forceLogout(session.id);

            toast.success(`Berhasil logout paksa akun ${session.name}`);

            queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ?? "Gagal logout paksa akun ini",
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

            {/* TABLE */}
            <div
                className="
                    rounded-[28px]
                    border
                    border-zinc-200
                    bg-white
                    overflow-hidden
                "
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr
                                className="
                                    border-b
                                    border-zinc-100
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-zinc-400
                                "
                            >
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Login Sejak</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-10 text-center text-zinc-500"
                                    >
                                        Tidak ada sesi aktif saat ini.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((session: ActiveSession) => (
                                    <tr
                                        key={session.id}
                                        className="hover:bg-zinc-50/50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="
                                                            relative
                                                            flex
                                                            h-10
                                                            w-10
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            bg-black
                                                            text-xs
                                                            font-semibold
                                                            uppercase
                                                            text-white
                                                            flex-shrink-0
                                                        "
                                                >
                                                    {session.name.charAt(0)}

                                                    <span
                                                        className="
                                                                absolute
                                                                -bottom-0.5
                                                                -right-0.5
                                                                h-3
                                                                w-3
                                                                rounded-full
                                                                bg-emerald-500
                                                                border-2
                                                                border-white
                                                            "
                                                    />
                                                </div>

                                                <span className="font-medium">
                                                    {session.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-zinc-600">
                                            {session.username}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`
                                                        inline-flex
                                                        items-center
                                                        rounded-full
                                                        border
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        ${
                                                            roleBadge[
                                                                session.role
                                                            ] ??
                                                            "bg-zinc-100 text-zinc-600 border-zinc-200"
                                                        }
                                                    `}
                                            >
                                                {roleLabel[session.role] ??
                                                    session.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-zinc-500">
                                            {session.logged_in_at
                                                ? new Date(
                                                      session.logged_in_at,
                                                  ).toLocaleString("id-ID", {
                                                      day: "2-digit",
                                                      month: "short",
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : "-"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() =>
                                                        handleForceLogout(
                                                            session,
                                                        )
                                                    }
                                                    disabled={
                                                        processingId ===
                                                        session.id
                                                    }
                                                    className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            rounded-xl
                                                            border
                                                            border-red-200
                                                            bg-red-50
                                                            px-3
                                                            py-2
                                                            text-xs
                                                            font-medium
                                                            text-red-600
                                                            transition
                                                            hover:bg-red-100
                                                            disabled:opacity-50
                                                            cursor-pointer
                                                        "
                                                >
                                                    <LogOut size={13} />
                                                    {processingId === session.id
                                                        ? "Memproses..."
                                                        : "Logout Paksa"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
