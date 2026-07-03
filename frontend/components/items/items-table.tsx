"use client";

import { AlertTriangle, ShieldCheck, Boxes } from "lucide-react";
import DataTable from "@/components/ui/data-table";
import TableEmpty from "@/components/ui/table-empty";
import TableAction from "../ui/table-action";

interface Props {
    items?: any[];
    search?: string;
    loading?: boolean;
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
}

export default function ItemsTable({
    items = [],
    search = "",
    loading = false,
    onEdit,
    onDelete,
}: Props) {
    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : {};

    const isAdmin = user.role === "admin" || user.role === "super_admin";

    /* ================= MOBILE ================= */
    return (
        <>
            <div className="lg:hidden space-y-3">
                {/* SKELETON */}
                {loading &&
                    Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}

                {/* EMPTY */}
                {!loading && items.length === 0 && (
                    <div className="py-10">
                        <TableEmpty
                            title="Barang tidak ditemukan"
                            description={`Tidak ada hasil untuk "${search}"`}
                        />
                    </div>
                )}

                {/* DATA */}
                {!loading &&
                    items.map((item) => {
                        const lowStock = item.total_stock <= item.stok_minimal;

                        return (
                            <div
                                key={item.id}
                                className="
                                    bg-white
                                    border
                                    rounded-2xl
                                    p-4
                                    shadow-sm
                                    active:scale-[0.99]
                                    transition-all
                                "
                            >
                                {/* TOP */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                                            <Boxes
                                                size={18}
                                                className="text-zinc-600"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm truncate">
                                                {item.nama_barang}
                                            </p>

                                            <p className="text-xs text-zinc-500 mt-0.5 truncate">
                                                {item.kode_barang}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ACTION */}
                                    {isAdmin && (
                                        <TableAction
                                            onEdit={() => onEdit?.(item)}
                                            onDelete={() => onDelete?.(item)}
                                        />
                                    )}
                                </div>

                                {/* META */}
                                <div className="flex items-center justify-between mt-4">
                                    {/* CATEGORY */}
                                    <span className="text-xs bg-zinc-100 px-2.5 py-1 rounded-full text-zinc-600">
                                        {item.category?.name || "-"}
                                    </span>

                                    {/* STATUS */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`
                                                w-2 h-2 rounded-full
                                                ${
                                                    lowStock
                                                        ? "bg-red-500"
                                                        : "bg-emerald-500"
                                                }
                                            `}
                                        />
                                        <span className="text-xs text-zinc-500">
                                            {lowStock
                                                ? "Perlu Restock"
                                                : "Aman"}
                                        </span>
                                    </div>
                                </div>

                                {/* STOCK */}
                                <div className="mt-3 flex items-end justify-between">
                                    <p
                                        className={`
                                            text-lg font-bold
                                            ${
                                                lowStock
                                                    ? "text-red-600"
                                                    : "text-zinc-900"
                                            }
                                        `}
                                    >
                                        {item.total_stock}
                                    </p>

                                    <p className="text-xs text-zinc-400">
                                        Min {item.stok_minimal}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* ================= DESKTOP ================= */}
            <div className="hidden lg:block">
                <DataTable
                    loading={loading}
                    isEmpty={!loading && items.length === 0}
                    headers={[
                        { label: "Barang" },
                        { label: "Kategori" },
                        { label: "Stock", align: "center" },
                        { label: "Status", align: "center" },
                        ...(isAdmin
                            ? [{ label: "Aksi", align: "right" as const }]
                            : []),
                    ]}
                    empty={
                        <TableEmpty
                            title={
                                search
                                    ? "Barang tidak ditemukan"
                                    : "Belum ada barang"
                            }
                            description={
                                search
                                    ? `Tidak ada hasil untuk "${search}"`
                                    : "Data barang akan muncul di sini"
                            }
                        />
                    }
                >
                    {/* SKELETON */}
                    {loading &&
                        Array.from({ length: 6 }).map((_, i) => (
                            <tr key={i}>
                                <td colSpan={5}>
                                    <SkeletonRow />
                                </td>
                            </tr>
                        ))}

                    {!loading &&
                        items.map((item) => {
                            const lowStock =
                                item.total_stock <= item.stok_minimal;

                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-zinc-50/70 transition-all"
                                >
                                    {/* BARANG */}
                                    <td className="px-6 py-5 border-b">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                                                <Boxes size={20} />
                                            </div>

                                            <div>
                                                <p className="font-semibold">
                                                    {item.nama_barang}
                                                </p>
                                                <p className="text-sm text-zinc-500">
                                                    {item.kode_barang}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* KATEGORI */}
                                    <td className="px-6 py-5 border-b">
                                        <span className="bg-zinc-100 px-3 py-1.5 rounded-full text-xs">
                                            {item.category?.name || "-"}
                                        </span>
                                    </td>

                                    {/* STOCK */}
                                    <td className="text-center px-6 py-5 border-b">
                                        <p
                                            className={`text-xl font-bold ${
                                                lowStock
                                                    ? "text-red-600"
                                                    : "text-emerald-600"
                                            }`}
                                        >
                                            {item.total_stock}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            Min {item.stok_minimal}
                                        </p>
                                    </td>

                                    {/* STATUS */}
                                    <td className="text-center px-6 py-5 border-b">
                                        <StatusBadge
                                            label={
                                                lowStock
                                                    ? "Perlu Restock"
                                                    : "Stock Aman"
                                            }
                                            variant={
                                                lowStock ? "danger" : "success"
                                            }
                                        />
                                    </td>

                                    {/* AKSI */}
                                    {isAdmin && (
                                        <td className="px-6 py-5 border-b w-12 h-12">
                                            <TableAction
                                                onEdit={() => onEdit?.(item)}
                                                onDelete={() =>
                                                    onDelete?.(item)
                                                }
                                            />
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                </DataTable>
            </div>
        </>
    );
}

/* ================= SKELETON ================= */

function SkeletonCard() {
    return (
        <div className="bg-white border rounded-2xl p-4 animate-pulse">
            <div className="flex justify-between">
                <div className="flex gap-3">
                    <div className="w-10 h-10 bg-zinc-200 rounded-xl" />
                    <div className="space-y-2">
                        <div className="w-32 h-3 bg-zinc-200 rounded" />
                        <div className="w-20 h-3 bg-zinc-100 rounded" />
                    </div>
                </div>
                <div className="w-6 h-6 bg-zinc-200 rounded" />
            </div>

            <div className="flex justify-between mt-4">
                <div className="w-20 h-3 bg-zinc-200 rounded" />
                <div className="w-16 h-3 bg-zinc-200 rounded" />
            </div>

            <div className="flex justify-between mt-3">
                <div className="w-10 h-4 bg-zinc-200 rounded" />
                <div className="w-16 h-3 bg-zinc-100 rounded" />
            </div>
        </div>
    );
}

function SkeletonRow() {
    return (
        <div className="px-6 py-5 animate-pulse">
            <div className="h-4 bg-zinc-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-zinc-100 rounded w-1/4" />
        </div>
    );
}

/* ================= STATUS ================= */

function StatusBadge({
    label,
    variant,
}: {
    label: string;
    variant: "success" | "danger";
}) {
    return (
        <div
            className={`
                inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold
                ${
                    variant === "success"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                }
            `}
        >
            {variant === "success" ? (
                <ShieldCheck size={14} />
            ) : (
                <AlertTriangle size={14} />
            )}
            {label}
        </div>
    );
}
