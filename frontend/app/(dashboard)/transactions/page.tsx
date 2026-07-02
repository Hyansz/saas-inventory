"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { motion } from "framer-motion";
import { getTransactions } from "@/services/transactions";
import { downloadPdf } from "@/services/reports";
import TablePagination from "@/components/ui/table-paginaton";
import TransactionsTable from "@/components/transaction/transaction-table";
import TableFilter from "@/components/ui/table-filter";

export default function TransactionsPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [type, setType] = useState("");
    const [page, setPage] = useState(1);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [openPrint, setOpenPrint] = useState(false);

    const [reportStartDate, setReportStartDate] = useState("");
    const [reportEndDate, setReportEndDate] = useState("");

    const [downloading, setDownloading] = useState(false);

    const queryClient = useQueryClient();

    const {
        data: transactions,
        isLoading: loading,
        isFetching,
    } = useQuery({
        queryKey: [
            "transactions",
            debouncedSearch,
            type,
            startDate,
            endDate,
            page,
        ],

        queryFn: () =>
            getTransactions({
                search: debouncedSearch,
                type,
                start_date: startDate,
                end_date: endDate,
                page,
            }),

        staleTime: 1000 * 60 * 5,

        gcTime: 1000 * 60 * 10,

        placeholderData: (previousData) => previousData,
    });

    const handlePrint = async () => {
        if (!reportStartDate || !reportEndDate) {
            alert("Silakan pilih periode laporan");
            return;
        }

        if (downloading) return;

        try {
            setDownloading(true);

            const blob = await downloadPdf({
                search,
                type,
                start_date: reportStartDate,
                end_date: reportEndDate,
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "laporan-transaksi.pdf";

            link.click();

            setOpenPrint(false);
        } catch (error) {
            console.log(error);
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        if (transactions && page < transactions.last_page) {
            queryClient.prefetchQuery({
                queryKey: [
                    "transactions",
                    debouncedSearch,
                    type,
                    startDate,
                    endDate,
                    page + 1,
                ],

                queryFn: () =>
                    getTransactions({
                        search: debouncedSearch,
                        type,
                        start_date: startDate,
                        end_date: endDate,
                        page: page + 1,
                    }),
            });
        }
    }, [
        page,
        transactions,
        debouncedSearch,
        type,
        startDate,
        endDate,
        queryClient,
    ]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-10 h-10 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
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

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.08),transparent_35%)]" />

                <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative z-10">
                    {/* TOP */}

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
                        <FileText size={14} />
                        Transaction Analytics
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
                                Riwayat Transaksi
                            </h1>

                            <p
                                className="
                                    mt-5
                                    max-w-2xl
                                    text-sm
                                    leading-relaxed
                                    text-zinc-300
                                    md:text-base
                                "
                            >
                                Pantau seluruh aktivitas barang masuk dan barang
                                keluar secara realtime. Seluruh histori
                                transaksi tersimpan dengan aman sehingga
                                memudahkan proses monitoring, audit, dan
                                pencetakan laporan inventory kapan saja.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* FILTERS */}
            <TableFilter
                search={search}
                setSearch={(value) => {
                    setPage(1);
                    setSearch(value);
                }}
                type={type}
                setType={(value) => {
                    setPage(1);
                    setType(value);
                }}
                date1={startDate}
                setDate1={(value) => {
                    setPage(1);
                    setStartDate(value);
                }}
                date2={endDate}
                setDate2={(value) => {
                    setPage(1);
                    setEndDate(value);
                }}
                onReset={() => {
                    setSearch("");
                    setType("");
                    setStartDate("");
                    setEndDate("");
                    setPage(1);
                }}
                loading={isFetching}
                searchPlaceholder="Cari nama barang"
                types={[
                    {
                        label: "Barang Masuk",
                        value: "IN",
                    },
                    {
                        label: "Barang Keluar",
                        value: "OUT",
                    },
                ]}
            />

            <TransactionsTable
                transactions={transactions?.data || []}
                loading={loading}
                fetching={isFetching}
                search={search}
            />

            {/* PAGINATION */}
            <TablePagination
                page={page}
                totalPages={transactions?.last_page || 1}
                setPage={setPage}
            />

            {/* MODAL PRINT */}
            {openPrint && (
                <div
                    className="
                        fixed
                        inset-0
                        bg-black/50
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        z-50
                        p-4
                    "
                >
                    <div
                        className="
                            bg-white
                            rounded-3xl
                            w-full
                            max-w-md
                            p-6
                            relative
                            animate-in
                            fade-in
                            zoom-in-95
                        "
                    >
                        <button
                            onClick={() => setOpenPrint(false)}
                            className="
                                absolute
                                top-4
                                right-4
                                w-9
                                h-9
                                rounded-xl
                                hover:bg-zinc-100
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <X size={18} />
                        </button>

                        <h2 className="text-2xl font-bold">Cetak Laporan</h2>

                        <p className="text-sm text-zinc-500 mt-1 mb-6">
                            Pilih periode laporan transaksi
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">
                                    Tanggal Mulai
                                </label>

                                <input
                                    type="date"
                                    value={reportStartDate}
                                    onChange={(e) =>
                                        setReportStartDate(e.target.value)
                                    }
                                    className="
                                        mt-2
                                        w-full
                                        h-12
                                        rounded-2xl
                                        border
                                        bg-zinc-50
                                        px-4
                                        text-sm
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-black
                                    "
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Tanggal Akhir
                                </label>

                                <input
                                    type="date"
                                    value={reportEndDate}
                                    onChange={(e) =>
                                        setReportEndDate(e.target.value)
                                    }
                                    className="
                                        mt-2
                                        w-full
                                        h-12
                                        rounded-2xl
                                        border
                                        bg-zinc-50
                                        px-4
                                        text-sm
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-black
                                    "
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-7">
                            <button
                                onClick={() => setOpenPrint(false)}
                                className="
                                    flex-1
                                    h-12
                                    rounded-2xl
                                    border
                                    font-medium
                                "
                            >
                                Batal
                            </button>

                            <button
                                onClick={handlePrint}
                                disabled={downloading}
                                className="
                                    flex-1
                                    h-12
                                    rounded-2xl
                                    bg-black
                                    text-white
                                    font-semibold
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                "
                            >
                                {downloading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Mengunduh...
                                    </>
                                ) : (
                                    "Download PDF"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
