"use client";

import { motion } from "framer-motion";
import {
    PackagePlus,
    Plus,
    Boxes,
    ArrowDownLeft,
    Calendar,
    Truck,
    Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStockIns, deleteStockIn } from "@/services/stock-in";
import AddStockInModal from "@/components/stock-in/add-stock-in-modal";
import EditStockInModal from "@/components/stock-in/edit-stock-in-modal";
import StockInsTable from "@/components/stock-in/stock-ins-table";
import TablePagination from "@/components/ui/table-paginaton";

const ITEMS_PER_PAGE = 10;

export default function StockInPage() {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : {};

    const isAdmin = user.role === "admin";

    const {
        data = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["stock-ins"],

        queryFn: async () => {
            const res = await getStockIns();

            return res.data;
        },

        staleTime: 1000 * 60 * 5,
    });

    const filteredData = useMemo(() => {
        return data.filter((item: any) =>
            item.item?.nama_barang
                ?.toLowerCase()
                .includes(search.toLowerCase()),
        );
    }, [data, search]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;

        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, page]);

    const totalQty = data.reduce(
        (acc: number, item: any) => acc + Number(item.qty),
        0,
    );

    const today = new Date().toISOString().split("T")[0];

    const todayQty = data
        .filter((item: any) => {
            const date = new Date(item.created_at).toISOString().split("T")[0];

            return date === today;
        })
        .reduce((acc: number, item: any) => acc + Number(item.qty), 0);

    const supplierCount = new Set(
        data
            .map((item: any) => item.supplier?.trim().toLowerCase())
            .filter(Boolean),
    ).size;

    const handleDelete = async (item: any) => {
        if (!confirm("Hapus stock masuk ini?")) return;

        try {
            await deleteStockIn(item.id);

            queryClient.invalidateQueries({
                queryKey: ["stock-ins"],
            });

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
                <div className="h-72 rounded-[32px] bg-zinc-100" />

                <div className="h-[500px] rounded-[32px] bg-zinc-100" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* HERO */}

            <motion.section
                initial={{
                    opacity: 0,
                    y: 18,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.35,
                }}
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
                {/* Glow */}

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
                            <PackagePlus size={14} />
                            Inventory Movement
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
                                Tambah Stock In
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
                                Stock In
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
                                Monitor seluruh aktivitas barang masuk secara
                                realtime dengan histori lengkap, validasi
                                transaksi, dan pencatatan inventory yang cepat,
                                aman, dan modern.
                            </p>
                        </div>
                    </div>

                    {/* STATS */}

                    <div className="mt-10 grid grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Transaksi"
                            value={data.length}
                            icon={<Boxes size={18} />}
                        />

                        <StatCard
                            title="Barang Masuk"
                            value={totalQty}
                            icon={<ArrowDownLeft size={18} />}
                            positive
                        />

                        <StatCard
                            title="Hari Ini"
                            value={todayQty}
                            icon={<Calendar size={18} />}
                        />

                        <StatCard
                            title="Supplier Aktif"
                            value={supplierCount}
                            icon={<Truck size={18} />}
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
                        placeholder="Cari barang..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
            <StockInsTable
                items={paginatedData}
                search={search}
                onEdit={
                    isAdmin
                        ? (item) => {
                              setSelectedItem(item);
                              setEditOpen(true);
                          }
                        : undefined
                }
                onDelete={isAdmin ? handleDelete : undefined}
            />

            {/* PAGINATION */}
            <TablePagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />

            {/* MODAL */}
            {isAdmin && (
                <>
                    <AddStockInModal
                        open={open}
                        onClose={() => setOpen(false)}
                        onSuccess={() => {
                            queryClient.invalidateQueries({
                                queryKey: ["stock-ins"],
                            });

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

                    <EditStockInModal
                        open={editOpen}
                        onClose={() => setEditOpen(false)}
                        item={selectedItem}
                        onSuccess={() => {
                            queryClient.invalidateQueries({
                                queryKey: ["stock-ins"],
                            });

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

function StatCard({ title, value, icon }: any) {
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
