"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/services/analytics";
import {
    AlertTriangle,
    BadgeCheck,
    Boxes,
    Activity,
    Package2,
    ArrowUpRight,
    TrendingUp,
    TrendingDown,
    Layers3,
    ShieldCheck,
    Clock3,
    Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { getItems } from "@/services/items";
import StockChart from "@/components/dashboard/stock-chart";

export default function StockMonitoringPage() {
    const { data: items = [], isLoading } = useQuery({
        queryKey: ["stock-monitoring"],

        queryFn: async () => {
            const res = await getItems({
                page: 1,
                limit: 9999,
            });

            return res.data;
        },

        staleTime: 1000 * 60 * 5,

        refetchOnWindowFocus: false,
    });

    const lowStockItems = useMemo(() => {
        return items
            .filter((i: any) => i.total_stock <= i.stok_minimal)
            .sort((a: any, b: any) => a.total_stock - b.total_stock)
            .slice(0, 5);
    }, [items]);

    const aman = items.filter(
        (i: any) => i.total_stock > i.stok_minimal,
    ).length;

    const menipis = items.filter(
        (i: any) => i.total_stock <= i.stok_minimal,
    ).length;

    const inventoryHealth = Math.round((aman / items.length) * 100 || 0);

    // =========================
    // ADVANCED ANALYTICS
    // =========================

    const totalStock = items.reduce(
        (acc: number, item: any) => acc + Number(item.total_stock || 0),
        0,
    );

    const avgStockPerItem = Math.round(totalStock / items.length || 0);

    const outOfStock = items.filter(
        (i: any) => Number(i.total_stock) <= 0,
    ).length;

    const criticalItems = items.filter(
        (i: any) =>
            Number(i.total_stock) > 0 &&
            Number(i.total_stock) <= Number(i.stok_minimal),
    ).length;

    const topStockItems = [...items]
        .sort((a: any, b: any) => Number(b.total_stock) - Number(a.total_stock))
        .slice(0, 5);

    const inventoryRisk =
        menipis > items.length / 2
            ? "High"
            : menipis > items.length / 4
              ? "Medium"
              : "Low";

    const riskColor =
        inventoryRisk === "High"
            ? "text-red-500"
            : inventoryRisk === "Medium"
              ? "text-amber-500"
              : "text-emerald-500";

    const healthConfig =
        inventoryHealth >= 90
            ? {
                  label: "Excellent",
                  text: "text-emerald-300",
                  badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
                  icon: "bg-emerald-500/15",
                  progress: "from-emerald-400 to-green-500",
              }
            : inventoryHealth >= 75
              ? {
                    label: "Good",
                    text: "text-sky-300",
                    badge: "bg-sky-500/10 border-sky-500/20 text-sky-300",
                    icon: "bg-sky-500/15",
                    progress: "from-sky-400 to-blue-500",
                }
              : inventoryHealth >= 50
                ? {
                      label: "Warning",
                      text: "text-amber-300",
                      badge: "bg-amber-500/10 border-amber-500/20 text-amber-300",
                      icon: "bg-amber-500/15",
                      progress: "from-amber-400 to-orange-500",
                  }
                : {
                      label: "Critical",
                      text: "text-red-300",
                      badge: "bg-red-500/10 border-red-500/20 text-red-300",
                      icon: "bg-red-500/15",
                      progress: "from-red-500 to-rose-500",
                  };

    function MiniMetric({ title, value }: { title: string; value: number }) {
        return (
            <div
                className="
                rounded-2xl
                bg-white/[0.04]
                border
                border-white/10
                p-4
            "
            >
                <p className="text-xs text-zinc-500">{title}</p>

                <h4 className="mt-2 text-2xl font-semibold">{value}</h4>
            </div>
        );
    }

    const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
        queryKey: ["analytics"],
        queryFn: getAnalytics,
        staleTime: 1000 * 60 * 2,
        refetchInterval: 1000 * 30, // realtime feel
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-black animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
                {/* GLOW */}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

                <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

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
                            <Activity size={14} />
                            Smart Inventory Analytics
                        </div>

                        <div
                            className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-green-500/20
                    bg-green-500/10
                    px-4
                    py-2
                    text-xs
                    text-green-300
                "
                        >
                            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                            Live Monitoring
                        </div>
                    </div>

                    {/* CONTENT */}

                    <div className="mt-12 grid gap-10 xl:grid-cols-[1.4fr_.9fr] xl:items-center">
                        {/* LEFT */}

                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45 }}
                                className="
                                    text-5xl
                                    md:text-7xl
                                    font-semibold
                                    tracking-tight
                                    leading-[0.95]
                                "
                            >
                                Stock
                                <br />
                                Monitoring
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 }}
                                className="
                                    mt-6
                                    max-w-2xl
                                    text-base
                                    leading-8
                                    text-zinc-400
                                "
                            >
                                Pantau seluruh kondisi inventory secara
                                realtime, identifikasi stok kritis lebih cepat,
                                dan ambil keputusan berbasis data dengan
                                dashboard modern yang cepat, ringan, dan
                                profesional.
                            </motion.p>
                        </div>

                        {/* RIGHT */}

                        <motion.div
                            initial={{ opacity: 0, x: 25 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.12 }}
                            whileHover={{ y: -4 }}
                            className="
                                rounded-[28px]
                                border
                                border-white/10
                                bg-white/[0.05]
                                backdrop-blur-xl
                                p-7
                            "
                        >
                            {/* HEADER */}

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[.25em] text-zinc-500">
                                        Inventory Health
                                    </p>

                                    <div className="mt-4 flex items-end gap-3">
                                        <motion.h2
                                            initial={{ scale: 0.92 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                duration: 0.45,
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                            className={`
                                                text-6xl
                                                font-bold
                                                tracking-tight
                                                ${healthConfig.text}
                                            `}
                                        >
                                            {inventoryHealth}
                                        </motion.h2>

                                        <span className="mb-2 text-2xl text-zinc-500">
                                            %
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={`
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        ${healthConfig.icon}
                                    `}
                                >
                                    <Activity
                                        size={24}
                                        className={healthConfig.text}
                                    />
                                </div>
                            </div>

                            {/* BADGE */}

                            <div className="mt-5">
                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        rounded-full
                                        border
                                        px-4
                                        py-2
                                        text-xs
                                        font-semibold
                                        ${healthConfig.badge}
                                    `}
                                >
                                    {healthConfig.label}
                                </span>
                            </div>

                            {/* PROGRESS */}

                            <div className="mt-8">
                                <div className="flex justify-between text-xs text-zinc-500 mb-3">
                                    <span>Kesehatan Inventory</span>
                                    <span>{inventoryHealth}%</span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${inventoryHealth}%`,
                                        }}
                                        transition={{
                                            duration: 0.9,
                                            ease: "easeOut",
                                        }}
                                        className={`
                                            h-full
                                            rounded-full
                                            bg-gradient-to-r
                                            ${healthConfig.progress}
                                        `}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* CORE STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total Barang"
                    value={items.length}
                    icon={<Boxes size={18} />}
                />

                <StatCard
                    title="Stock Aman"
                    value={aman}
                    icon={<BadgeCheck size={18} />}
                    color="green"
                />

                <StatCard
                    title="Stock Menipis"
                    value={menipis}
                    icon={<AlertTriangle size={18} />}
                    color="red"
                />

                <StatCard
                    title="Out of Stock"
                    value={outOfStock}
                    icon={<TrendingDown size={18} />}
                    color="red"
                />
            </div>

            {/* ADVANCED ANALYTICS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* INVENTORY OVERVIEW */}
                <div
                    className="
                    rounded-[28px]
                    border
                    border-zinc-200
                    bg-white
                    p-6
                    shadow-sm
                "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">
                                Inventory Overview
                            </h3>

                            <p className="text-sm text-zinc-500 mt-1">
                                Ringkasan performa inventory
                            </p>
                        </div>

                        <div
                            className="
                            w-11
                            h-11
                            rounded-2xl
                            bg-zinc-100
                            flex
                            items-center
                            justify-center
                        "
                        >
                            <Layers3 size={18} className="text-zinc-600" />
                        </div>
                    </div>

                    <div className="space-y-4 mt-6">
                        <OverviewRow
                            label="Total Stock"
                            value={`${totalStock} Unit`}
                        />

                        <OverviewRow
                            label="Average per Item"
                            value={`${avgStockPerItem} Unit`}
                        />

                        <OverviewRow
                            label="Critical Items"
                            value={`${criticalItems} Barang`}
                        />

                        <OverviewRow
                            label="Inventory Risk"
                            value={inventoryRisk}
                            valueClass={riskColor}
                        />
                    </div>
                </div>

                {/* SYSTEM STATUS */}
                <div
                    className="
                    rounded-[28px]
                    border
                    border-zinc-200
                    bg-white
                    p-6
                    shadow-sm
                "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">System Status</h3>

                            <p className="text-sm text-zinc-500 mt-1">
                                Monitoring status inventory
                            </p>
                        </div>

                        <div
                            className="
                            w-11
                            h-11
                            rounded-2xl
                            bg-green-100
                            flex
                            items-center
                            justify-center
                        "
                        >
                            <ShieldCheck size={18} className="text-green-600" />
                        </div>
                    </div>

                    <div className="space-y-4 mt-6">
                        <StatusItem
                            label="Realtime Sync"
                            status="Online"
                            color="green"
                        />

                        <StatusItem
                            label="Inventory Engine"
                            status="Healthy"
                            color="green"
                        />

                        <StatusItem
                            label="Critical Alerts"
                            status={menipis > 0 ? `${menipis} Active` : "None"}
                            color={menipis > 0 ? "amber" : "green"}
                        />

                        <StatusItem
                            label="Last Update"
                            status="Just now"
                            color="blue"
                        />
                    </div>
                </div>

                {/* QUICK INSIGHTS */}
                <div
                    className="
                    rounded-[28px]
                    border
                    border-zinc-200
                    bg-white
                    p-6
                    shadow-sm
                "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Quick Insights</h3>

                            <p className="text-sm text-zinc-500 mt-1">
                                AI-style inventory insights
                            </p>
                        </div>

                        <div
                            className="
                            w-11
                            h-11
                            rounded-2xl
                            bg-violet-100
                            flex
                            items-center
                            justify-center
                        "
                        >
                            <Sparkles size={18} className="text-violet-600" />
                        </div>
                    </div>

                    <div className="space-y-4 mt-6">
                        <InsightCard
                            icon={<TrendingUp size={16} />}
                            title="Healthy Inventory"
                            description={`${inventoryHealth}% barang dalam kondisi aman`}
                        />

                        <InsightCard
                            icon={<Clock3 size={16} />}
                            title="Restock Priority"
                            description={`${criticalItems} barang perlu perhatian segera`}
                        />

                        <InsightCard
                            icon={<BadgeCheck size={16} />}
                            title="System Stability"
                            description="Inventory monitoring berjalan normal"
                        />
                    </div>
                </div>
            </div>

            {/* STOCK MOVEMENT CHART */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* STOCK IN */}
                <div
                    className="
                        rounded-[28px]
                        border
                        border-zinc-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold">Stock Masuk</h3>
                            <p className="text-sm text-zinc-500 mt-1">
                                Tren barang masuk
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
                            <TrendingUp
                                size={18}
                                className="text-emerald-600"
                            />
                        </div>
                    </div>

                    {isAnalyticsLoading ? (
                        <div className="h-80 flex flex-col justify-end gap-2">
                            {[...Array(7)].map((_, i) => (
                                <SkeletonBox key={i} className="h-3 w-full" />
                            ))}
                        </div>
                    ) : analytics?.stock_in_chart?.length ? (
                        <StockChart
                            title="Stock Ins"
                            data={analytics.stock_in_chart}
                            dataKey="total"
                        />
                    ) : (
                        <div className="h-80 flex items-center justify-center text-sm text-zinc-400">
                            Belum ada data grafik
                        </div>
                    )}
                </div>

                {/* STOCK OUT */}
                <div
                    className="
                        rounded-[28px]
                        border
                        border-zinc-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold">Stock Keluar</h3>
                            <p className="text-sm text-zinc-500 mt-1">
                                Tren barang keluar
                            </p>
                        </div>

                        <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center">
                            <TrendingDown size={18} className="text-rose-600" />
                        </div>
                    </div>

                    {isAnalyticsLoading ? (
                        <div className="h-80 flex flex-col justify-end gap-2">
                            {[...Array(7)].map((_, i) => (
                                <SkeletonBox key={i} className="h-3 w-full" />
                            ))}
                        </div>
                    ) : analytics?.stock_out_chart?.length ? (
                        <StockChart
                            title="Stock Outs"
                            data={analytics.stock_out_chart}
                            dataKey="total"
                        />
                    ) : (
                        <div className="h-80 flex items-center justify-center text-sm text-zinc-400">
                            Belum ada data grafik
                        </div>
                    )}
                </div>
            </div>

            {/* TOP STOCK */}
            <div
                className="
                rounded-[28px]
                border
                border-zinc-200
                bg-white
                shadow-sm
                overflow-hidden
            "
            >
                <div
                    className="
                    px-6
                    py-5
                    border-b
                    border-zinc-100
                    flex
                    items-center
                    justify-between
                "
                >
                    <div>
                        <h2 className="text-lg font-semibold">
                            Highest Stock Items
                        </h2>

                        <p className="text-sm text-zinc-500 mt-1">
                            Barang dengan stock terbanyak
                        </p>
                    </div>

                    <div
                        className="
                        w-10
                        h-10
                        rounded-2xl
                        bg-green-50
                        text-green-600
                        flex
                        items-center
                        justify-center
                    "
                    >
                        <TrendingUp size={18} />
                    </div>
                </div>

                <div className="divide-y divide-zinc-100">
                    {topStockItems.map((item: any) => (
                        <div
                            key={item.id}
                            className="
                            px-6
                            py-5
                            flex
                            items-center
                            justify-between
                            hover:bg-zinc-50
                            transition
                        "
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="
                                    w-11
                                    h-11
                                    rounded-2xl
                                    bg-zinc-100
                                    flex
                                    items-center
                                    justify-center
                                "
                                >
                                    <Package2
                                        size={18}
                                        className="text-zinc-500"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="font-medium truncate">
                                        {item.nama_barang}
                                    </h3>

                                    <p className="text-sm text-zinc-500 mt-1">
                                        {item.category?.name}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="text-sm text-zinc-500">
                                    Total Stock
                                </p>

                                <div className="flex items-center gap-2 justify-end mt-1">
                                    <span className="text-2xl font-bold text-green-600">
                                        {item.total_stock}
                                    </span>

                                    <ArrowUpRight
                                        size={16}
                                        className="text-green-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CRITICAL ALERT */}
            <div
                className="
                rounded-[28px]
                border
                border-zinc-200
                bg-white
                shadow-sm
                overflow-hidden
            "
            >
                <div
                    className="
                    px-6
                    py-5
                    border-b
                    border-zinc-100
                    flex
                    items-center
                    justify-between
                "
                >
                    <div>
                        <h2 className="text-lg font-semibold">
                            Critical Stock Alerts
                        </h2>

                        <p className="text-sm text-zinc-500 mt-1">
                            Barang yang membutuhkan restock segera
                        </p>
                    </div>

                    <div
                        className="
                        w-10
                        h-10
                        rounded-2xl
                        bg-red-50
                        text-red-500
                        flex
                        items-center
                        justify-center
                    "
                    >
                        <AlertTriangle size={18} />
                    </div>
                </div>

                <div className="divide-y divide-zinc-100">
                    {lowStockItems.length > 0 ? (
                        lowStockItems.map((item: any) => (
                            <div
                                key={item.id}
                                className="
                                px-6
                                py-5
                                flex
                                items-center
                                justify-between
                                hover:bg-zinc-50
                                transition
                            "
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="
                                            w-11
                                            h-11
                                            rounded-2xl
                                            bg-zinc-100
                                            flex
                                            items-center
                                            justify-center
                                        "
                                        >
                                            <Package2
                                                size={18}
                                                className="text-zinc-500"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="font-medium">
                                                {item.nama_barang}
                                            </h3>

                                            <p className="text-sm text-zinc-500 mt-1">
                                                {item.category?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-zinc-500">
                                        Remaining Stock
                                    </p>

                                    <div className="flex items-center gap-2 justify-end mt-1">
                                        <span className="text-2xl font-bold text-red-600">
                                            {item.total_stock}
                                        </span>

                                        <ArrowUpRight
                                            size={16}
                                            className="text-red-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <div
                                className="
                                w-16
                                h-16
                                rounded-3xl
                                bg-green-100
                                text-green-600
                                flex
                                items-center
                                justify-center
                                mx-auto
                                mb-5
                            "
                            >
                                <BadgeCheck size={28} />
                            </div>

                            <h3 className="text-lg font-semibold">
                                Semua stock aman
                            </h3>

                            <p className="text-sm text-zinc-500 mt-2">
                                Tidak ada barang yang perlu restock.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SkeletonBox({ className = "" }: any) {
    return (
        <div
            className={`
                animate-pulse
                bg-zinc-200
                rounded-lg
                ${className}
            `}
        />
    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <div
            className="
            bg-white
            border
            border-zinc-200
            rounded-[28px]
            p-5
            shadow-sm
        "
        >
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{title}</p>

                <div className="text-zinc-400">{icon}</div>
            </div>

            <h3
                className={`
                text-3xl
                font-bold
                mt-4
                ${
                    color === "green"
                        ? "text-green-600"
                        : color === "red"
                          ? "text-red-600"
                          : "text-black"
                }
            `}
            >
                {value}
            </h3>
        </div>
    );
}

function OverviewRow({ label, value, valueClass = "" }: any) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">{label}</span>

            <span className={`font-semibold ${valueClass}`}>{value}</span>
        </div>
    );
}

function StatusItem({ label, status, color }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div
                    className={`
                    w-2.5
                    h-2.5
                    rounded-full
                    ${
                        color === "green"
                            ? "bg-green-500"
                            : color === "amber"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                    }
                `}
                />

                <span className="text-sm text-zinc-600">{label}</span>
            </div>

            <span className="text-sm font-medium">{status}</span>
        </div>
    );
}

function InsightCard({ icon, title, description }: any) {
    return (
        <div
            className="
            rounded-2xl
            border
            border-zinc-100
            bg-zinc-50
            p-4
        "
        >
            <div className="flex items-start gap-3">
                <div
                    className="
                    w-9
                    h-9
                    rounded-xl
                    bg-white
                    border
                    border-zinc-200
                    flex
                    items-center
                    justify-center
                    shrink-0
                "
                >
                    {icon}
                </div>

                <div>
                    <h4 className="font-medium text-sm">{title}</h4>

                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
