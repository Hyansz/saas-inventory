"use client";

import {
    Package,
    FolderTree,
    ArrowDownLeft,
    ArrowUpRight,
    AlertTriangle,
    Activity,
    TrendingUp,
    Sparkles,
    Boxes,
    History,
    ShieldCheck,
    Clock3,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getDashboard } from "@/services/dashboard";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { getActivityStyle } from "@/utils/activity-style";

export default function DashboardPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboard,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 30,
    });

    if (isLoading || !data) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-72 rounded-[2rem] bg-zinc-200" />
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-40 rounded-[2rem] bg-zinc-200"
                        />
                    ))}
                </div>
                <div className="h-96 rounded-[2rem] bg-zinc-200" />
            </div>
        );
    }

    const summary = data.summary || {};

    return (
        <div className="space-y-6">
            {/* HERO */}

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
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
                {/* BACKGROUND GLOW */}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative z-10">
                    {/* TOP */}

                    <div className="flex items-center justify-between gap-3">
                        <div
                            className="
                                inline-flex
                                shrink-0
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-white/10
                                bg-white/10
                                px-3
                                md:px-4
                                py-2
                                text-[10px]
                                md:text-xs
                                font-medium
                                backdrop-blur-xl
                                whitespace-nowrap
                            "
                        >
                            <Sparkles size={14} />
                            Analitik Inventory Pintar
                        </div>

                        <div
                            className="
                                inline-flex
                                shrink-0
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-emerald-500/20
                                bg-emerald-500/15
                                px-3
                                md:px-4
                                py-2
                                text-[10px]
                                md:text-xs
                                text-emerald-300
                                whitespace-nowrap
                            "
                        >
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            Sistem Online
                        </div>
                    </div>

                    {/* CONTENT */}

                    <div className="mt-12">
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
                                Pusat Kontrol Inventory
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
                                Platform monitoring inventory profesional dengan
                                analitik gudang realtime, pelacakan pergerakan
                                stok, notifikasi pintar, dan insight operasional
                                dalam satu dashboard modern.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* KPI */}

            <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Barang"
                    value={summary.total_items || 0}
                    icon={<Package size={18} />}
                />

                <MetricCard
                    title="Kategori"
                    value={summary.total_categories || 0}
                    icon={<FolderTree size={18} />}
                />

                <MetricCard
                    title="Stok Masuk"
                    value={summary.today_stock_in || 0}
                    icon={<ArrowDownLeft size={18} />}
                    positive
                />

                <MetricCard
                    title="Stok Keluar"
                    value={summary.today_stock_out || 0}
                    icon={<ArrowUpRight size={18} />}
                    danger
                />

                <MetricCard
                    title="Kesehatan Inventory"
                    value={`${summary.inventory_health || 0}%`}
                    icon={<Activity size={18} />}
                    positive
                />

                <MetricCard
                    title="Barang Kritis"
                    value={summary.low_stock_count || 0}
                    icon={<AlertTriangle size={18} />}
                    danger
                />

                <MetricCard
                    title="Pergerakan Stok"
                    value={summary.total_movements || 0}
                    icon={<TrendingUp size={18} />}
                />

                <MetricCard
                    title="Aktivitas Realtime"
                    value={data.activities?.length || 0}
                    icon={<Clock3 size={18} />}
                />
            </section>

            {/* CONTENT */}

            <section className="grid grid-cols-1 2xl:grid-cols-3 gap-5">
                <div className="space-y-5">
                    <DashboardCard
                        title="Aktivitas Terbaru"
                        subtitle="Aktivitas inventory terbaru"
                        icon={<History size={20} />}
                        iconColor="activity"
                    >
                        <div className="space-y-3">
                            {data.activities?.length ? (
                                data.activities.map((activity: any) => {
                                    const style = getActivityStyle(activity);

                                    return (
                                        <div
                                            key={activity.id}
                                            className="
                                                flex
                                                items-center
                                                gap-4
                                                rounded-2xl
                                                border
                                                border-zinc-200
                                                p-4
                                                transition
                                                hover:bg-zinc-50
                                            "
                                        >
                                            {/* DOT (dynamic color) */}
                                            <div
                                                className={`
                                                    mt-1
                                                    h-2.5
                                                    w-2.5
                                                    rounded-full
                                                    ${style.dot}
                                                    animate-pulse
                                                    shrink-0
                                                `}
                                            />

                                            {/* CONTENT */}
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium leading-relaxed">
                                                    {activity.message}
                                                </p>

                                                <p className="mt-2 text-xs text-zinc-500">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <EmptyState text="Belum ada aktivitas" />
                            )}
                        </div>
                    </DashboardCard>
                </div>
            </section>
        </div>
    );
}

/* KPI */

function MetricCard({ title, value, icon, positive, danger }: any) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="
                group
                relative
                overflow-hidden
                rounded-[2rem]
                border
                border-zinc-200
                bg-white
                p-5
                shadow-sm
                transition-all
                hover:shadow-xl
            "
        >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="relative z-10">
                <div
                    className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        ${
                            positive
                                ? "bg-green-100 text-green-600"
                                : danger
                                  ? "bg-red-100 text-red-600"
                                  : "bg-zinc-100 text-zinc-700"
                        }
                    `}
                >
                    {icon}
                </div>

                <div className="mt-5">
                    <p className="text-sm text-zinc-500">{title}</p>

                    <div className="mt-2 flex items-end justify-between">
                        <h3 className="text-3xl font-semibold tracking-tight">
                            {value}
                        </h3>

                        <TrendingUp size={16} className="text-zinc-300" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* EMPTY */

function EmptyState({ text }: any) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-dashed
                py-10
                text-center
                text-sm
                text-zinc-500
            "
        >
            {text}
        </div>
    );
}

/* ACTIVITY */

function ActivityList({ data, type }: any) {
    if (!data?.length) {
        return <EmptyState text="Belum ada aktivitas" />;
    }

    return (
        <div className="space-y-3">
            {data.map((item: any) => (
                <div
                    key={item.id}
                    className="
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        border-zinc-200
                        p-4
                        transition
                        hover:bg-zinc-50
                    "
                >
                    <div className="min-w-0">
                        <p className="font-medium truncate">
                            {item.item?.nama_barang}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                            Aktivitas inventory
                        </p>
                    </div>

                    <div
                        className={`
                            rounded-xl
                            px-3
                            py-2
                            text-sm
                            font-semibold
                            ${
                                type === "in"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                            }
                        `}
                    >
                        {type === "in" ? "+" : "-"}
                        {item.qty}
                    </div>
                </div>
            ))}
        </div>
    );
}
