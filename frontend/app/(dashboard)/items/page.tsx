"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Plus,
    Boxes,
    AlertTriangle,
    Sparkles,
    ShieldCheck,
    Activity,
} from "lucide-react";

import { motion } from "framer-motion";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getItems, deleteItem } from "@/services/items";

import ItemsTable from "@/components/items/items-table";
import AddItemModal from "@/components/items/add-item-modal";
import EditItemModal from "@/components/items/edit-item-modal";
import TableStock from "@/components/ui/table-stock";
import TablePagination from "@/components/ui/table-paginaton";

const ITEMS_PER_PAGE = 10;

export default function ItemsPage() {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("all");
    const [isAdmin, setIsAdmin] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        setIsAdmin(user.role === "admin");
    }, []);

    const {
        data: response,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["items"],

        queryFn: async () => {
            return await getItems({
                page: 1,
                limit: 9999,
            });
        },

        staleTime: 1000 * 60 * 5,

        refetchOnWindowFocus: false,
    });

    const allItems = response?.data || [];

    const aman = allItems.filter(
        (i: any) => i.total_stock > i.stok_minimal,
    ).length;

    const menipisItems = allItems.filter(
        (i: any) => i.total_stock <= i.stok_minimal,
    );

    const filteredItems = useMemo(() => {
        let data = allItems;

        if (filter === "safe") {
            data = data.filter((i: any) => i.total_stock > i.stok_minimal);
        }

        if (filter === "warning") {
            data = data.filter((i: any) => i.total_stock <= i.stok_minimal);
        }

        if (search.trim()) {
            data = data.filter((item: any) =>
                item.nama_barang?.toLowerCase().includes(search.toLowerCase()),
            );
        }

        return data;
    }, [allItems, search, filter]);

    useEffect(() => {
        setPage(1);
    }, [search, filter]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;

        return filteredItems.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredItems, page]);

    const handleDelete = async (item: any) => {
        if (!confirm("Hapus barang ini?")) return;

        try {
            await deleteItem(item.id);

            queryClient.invalidateQueries({
                queryKey: ["items"],
            });

            queryClient.invalidateQueries({
                queryKey: ["dashboard"],
            });

            queryClient.invalidateQueries({
                queryKey: ["stock-monitoring"],
            });

            queryClient.invalidateQueries({
                queryKey: ["analytics"],
            });
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-80 rounded-[2.5rem] bg-zinc-200" />

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-40 rounded-[2rem] bg-zinc-200"
                        />
                    ))}
                </div>

                <div className="h-24 rounded-[2rem] bg-zinc-200" />

                <div className="h-[600px] rounded-[2rem] bg-zinc-200" />
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
                {/* GLOW */}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

                <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

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
                            <Sparkles size={14} />
                            Smart Inventory Management
                        </div>

                        {isAdmin && (
                            <button
                                onClick={() => setOpen(true)}
                                className="
                                    inline-flex
                                    h-12
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    bg-white
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-black
                                    transition-all
                                    hover:scale-[1.02]
                                    active:scale-[0.99]
                                    cursor-pointer
                                "
                            >
                                <Plus size={18} />
                                Tambah Barang
                            </button>
                        )}
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
                                Inventory Items
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
                                Kelola seluruh data inventory secara realtime
                                dengan monitoring stok modern, sistem tracking
                                pintar, dan pengalaman operasional premium.
                            </p>
                        </div>
                    </div>

                    {/* STATS */}

                    <div className="mt-10 grid grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Barang"
                            value={allItems.length}
                            icon={<Boxes size={18} />}
                        />

                        <StatCard
                            title="Stock Aman"
                            value={aman}
                            icon={<ShieldCheck size={18} />}
                            positive
                        />

                        <StatCard
                            title="Perlu Restock"
                            value={menipisItems.length}
                            icon={<AlertTriangle size={18} />}
                            danger
                        />

                        <StatCard
                            title="Aktivitas Inventory"
                            value={allItems.length}
                            icon={<Activity size={18} />}
                        />
                    </div>
                </div>
            </motion.section>

            {/* ALERT */}

            {menipisItems.length > 0 && (
                <div
                    className="
                        relative
                        overflow-hidden
                        rounded-[2rem]
                        border
                        border-amber-200
                        bg-gradient-to-br
                        from-amber-50
                        to-white
                        p-5
                    "
                >
                    <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-amber-200/20 blur-3xl" />

                    <div className="relative flex items-start gap-4">
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-amber-100
                                text-amber-600
                            "
                        >
                            <AlertTriangle size={20} />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-base font-semibold text-zinc-900">
                                    Stock membutuhkan perhatian
                                </h3>

                                <div
                                    className="
                                        rounded-full
                                        bg-amber-100
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                        text-amber-700
                                    "
                                >
                                    {menipisItems.length} item
                                </div>
                            </div>

                            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                                Beberapa inventory telah mencapai batas minimum
                                stock dan disarankan untuk segera dilakukan
                                restock.
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {menipisItems.slice(0, 5).map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="
                                            rounded-full
                                            border
                                            border-amber-200
                                            bg-white/80
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-medium
                                            text-zinc-700
                                            backdrop-blur
                                        "
                                    >
                                        {item.nama_barang}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TOOLBAR */}
            <TableStock
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
            />

            {/* TABLE */}

            <div
                className="
                    overflow-hidden
                    rounded-[2rem]
                "
            >
                <ItemsTable
                    items={paginatedItems}
                    onEdit={
                        isAdmin
                            ? (item) => {
                                  setSelectedItem(item);
                                  setEditOpen(true);
                              }
                            : undefined
                    }
                    search={search}
                    onDelete={isAdmin ? handleDelete : undefined}
                />
            </div>

            {/* PAGINATION */}

            <TablePagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />

            {/* MODAL */}

            {isAdmin && (
                <>
                    <AddItemModal
                        open={open}
                        onClose={() => setOpen(false)}
                        onSuccess={() => {
                            queryClient.invalidateQueries({
                                queryKey: ["items"],
                            });

                            queryClient.invalidateQueries({
                                queryKey: ["dashboard"],
                            });

                            queryClient.invalidateQueries({
                                queryKey: ["stock-monitoring"],
                            });

                            queryClient.invalidateQueries({
                                queryKey: ["analytics"],
                            });
                        }}
                    />

                    <EditItemModal
                        open={editOpen}
                        item={selectedItem}
                        onClose={() => setEditOpen(false)}
                        onSuccess={() => {
                            queryClient.invalidateQueries({
                                queryKey: ["items"],
                            });

                            queryClient.invalidateQueries({
                                queryKey: ["dashboard"],
                            });

                            queryClient.invalidateQueries({
                                queryKey: ["stock-monitoring"],
                            });

                            queryClient.invalidateQueries({
                                queryKey: ["analytics"],
                            });
                        }}
                    />
                </>
            )}
        </div>
    );
}

/* STAT CARD */

function StatCard({ title, value, icon, positive, danger }: any) {
    return (
        <div
            className="
                rounded-[2rem]
                border
                border-white/10
                bg-white/[0.05]
                p-5
                backdrop-blur-xl
            "
        >
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">{title}</p>

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-2xl
                        ${
                            positive
                                ? "bg-emerald-500/15 text-emerald-300"
                                : danger
                                  ? "bg-red-500/15 text-red-300"
                                  : "bg-white/10 text-zinc-300"
                        }
                    `}
                >
                    {icon}
                </div>
            </div>

            <h3
                className={`
                    mt-5
                    text-3xl
                    font-semibold
                    tracking-tight
                    ${
                        positive
                            ? "text-emerald-300"
                            : danger
                              ? "text-red-300"
                              : "text-white"
                    }
                `}
            >
                {value}
            </h3>
        </div>
    );
}
