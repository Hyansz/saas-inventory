"use client";

import { motion } from "framer-motion";
import { ClipboardList, Plus, Boxes, CheckCircle2, PenLine } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStockOpnames, deleteStockOpname } from "@/services/stock-opname";
import CreateOpnameModal from "@/components/stock-opname/create-opname-modal";
import OpnameDetailModal from "@/components/stock-opname/opname-detail-modal";
import OpnameTable from "@/components/stock-opname/opname-table";
import TablePagination from "@/components/ui/table-paginaton";

const ITEMS_PER_PAGE = 10;

export default function StockOpnamePage() {
    const [createOpen, setCreateOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedOpname, setSelectedOpname] = useState<any>(null);
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
    } = useQuery({
        queryKey: ["stock-opnames", page],

        queryFn: async () => {
            const res = await getStockOpnames(page);

            return res.data;
        },

        staleTime: 1000 * 60 * 2,
    });

    const list = data?.data ?? [];
    const total = data?.statistics?.total ?? 0;
    const completedCount = data?.statistics?.completed ?? 0;
    const draftCount = data?.statistics?.draft ?? 0;

    const handleDelete = async (opname: any) => {
        if (!confirm("Hapus opname draft ini?")) return;

        try {
            await deleteStockOpname(opname.id);

            queryClient.invalidateQueries({
                queryKey: ["stock-opnames"],
            });
        } catch (err: any) {
            console.log(err);

            alert(err.response?.data?.message || "Gagal hapus opname");
        }
    };

    const refreshAll = () => {
        queryClient.invalidateQueries({ queryKey: ["stock-opnames"] });
        queryClient.invalidateQueries({ queryKey: ["items"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["stock-monitoring"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
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

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

                <div className="relative z-10">
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
                            <ClipboardList size={14} />
                            Stock Take / Reconciliation
                        </div>

                        <button
                            onClick={() => setCreateOpen(true)}
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
                            Buat Opname
                        </button>
                    </div>

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
                                Stock Opname
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
                                Bandingkan stok sistem dengan hasil hitung
                                fisik di gudang. Selisih otomatis dicatat sebagai
                                transaksi adjustment dengan alasan wajib.
                            </p>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Total Opname"
                            value={total}
                            icon={<Boxes size={18} />}
                        />

                        <StatCard
                            title="Selesai"
                            value={completedCount}
                            icon={<CheckCircle2 size={18} />}
                            positive
                        />

                        <StatCard
                            title="Draft Berjalan"
                            value={draftCount}
                            icon={<PenLine size={18} />}
                        />
                    </div>
                </div>
            </motion.section>

            {/* TABLE */}
            <OpnameTable
                items={list}
                onDetail={(opname) => {
                    setSelectedOpname(opname);
                    setDetailOpen(true);
                }}
                onDelete={handleDelete}
            />

            {/* PAGINATION */}
            <TablePagination
                page={page}
                totalPages={Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))}
                setPage={setPage}
            />

            {/* MODALS */}
            <CreateOpnameModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={refreshAll}
            />

            <OpnameDetailModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                opnameId={selectedOpname?.id ?? null}
                onSuccess={refreshAll}
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

                <div
                    className={positive ? "text-emerald-400" : "text-zinc-500"}
                >
                    {icon}
                </div>
            </div>

            <h3 className="mt-4 text-3xl font-bold">{value}</h3>
        </div>
    );
}
