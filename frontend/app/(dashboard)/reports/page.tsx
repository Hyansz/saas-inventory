"use client";

import { useState } from "react";
import {
    FileSpreadsheet,
    CalendarDays,
    ChevronDown,
    Download,
    FileText,
    LoaderCircle,
    Printer,
} from "lucide-react";
import { motion } from "framer-motion";
import { downloadExcel, downloadPdf } from "@/services/reports";

export default function ReportsPage() {
    const [reportType, setReportType] = useState("transactions");

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    const [excelLoading, setExcelLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    const handleExportExcel = async () => {
        if (!startDate || !endDate) {
            alert("Pilih tanggal terlebih dahulu");
            return;
        }

        if (excelLoading || pdfLoading) return;

        try {
            setExcelLoading(true);

            const blob = await downloadExcel({
                type: reportType,
                start_date: startDate,
                end_date: endDate,
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `laporan-${reportType}.xlsx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        } finally {
            setExcelLoading(false);
        }
    };

    const handleExportPdf = async () => {
        if (!startDate || !endDate) {
            alert("Pilih tanggal terlebih dahulu");
            return;
        }

        if (pdfLoading || excelLoading) return;

        try {
            setPdfLoading(true);

            const blob = await downloadPdf({
                type: reportType,
                start_date: startDate,
                end_date: endDate,
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `laporan-${reportType}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        } finally {
            setPdfLoading(false);
        }
    };

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
                {/* Glow */}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

                <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

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
                            <FileSpreadsheet size={14} />
                            Export Center
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
                                Laporan Inventory
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
                                Generate laporan inventory profesional dalam
                                format Excel maupun PDF. Semua transaksi barang
                                masuk, barang keluar, dan histori inventory
                                dapat diekspor dengan cepat untuk kebutuhan
                                audit maupun pelaporan bisnis.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* FORM */}
            <div
                className="
                    bg-white
                    border
                    rounded-3xl
                    p-5
                    md:p-6
                    shadow-sm
                    space-y-5
                "
            >
                {/* REPORT TYPE */}
                <div>
                    <label className="text-sm font-medium">Jenis Laporan</label>

                    <div className="relative mt-2">
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="
                                appearance-none
                                w-full
                                h-12
                                rounded-2xl
                                border
                                bg-zinc-50
                                px-4
                                pr-12
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-black
                                cursor-pointer
                            "
                        >
                            <option value="transactions">Transaksi</option>

                            <option value="stock-ins">Barang Masuk</option>

                            <option value="stock-outs">Barang Keluar</option>

                            <option value="stock">Stock Barang</option>
                        </select>

                        <ChevronDown
                            size={18}
                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-zinc-500
                                pointer-events-none
                            "
                        />
                    </div>
                </div>

                {/* DATES */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                        <label className="text-sm font-medium">
                            Tanggal Mulai
                        </label>

                        <CalendarDays
                            size={18}
                            className="
                                absolute
                                left-4
                                bottom-3.5
                                text-zinc-400
                            "
                        />

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="
                                mt-2
                                w-full
                                h-12
                                rounded-2xl
                                border
                                bg-zinc-50
                                pl-11
                                pr-4
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-black
                            "
                        />
                    </div>

                    <div className="relative">
                        <label className="text-sm font-medium">
                            Tanggal Akhir
                        </label>

                        <CalendarDays
                            size={18}
                            className="
                                absolute
                                left-4
                                bottom-3.5
                                text-zinc-400
                            "
                        />

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="
                                mt-2
                                w-full
                                h-12
                                rounded-2xl
                                border
                                bg-zinc-50
                                pl-11
                                pr-4
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-black
                            "
                        />
                    </div>
                </div>

                {/* ACTION */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* EXCEL BUTTON */}
                    <button
                        onClick={handleExportExcel}
                        disabled={excelLoading || pdfLoading}
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-zinc-200
                            bg-white
                            p-5
                            text-left
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:shadow-xl
                            hover:border-green-200
                            disabled:opacity-70
                            disabled:pointer-events-none
                            cursor-pointer
                        "
                    >
                        <div
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-br
                                from-green-50
                                to-transparent
                                opacity-0
                                group-hover:opacity-100
                                transition
                            "
                        />

                        <div className="relative flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className="
                                        w-14
                                        h-14
                                        rounded-2xl
                                        bg-green-100
                                        text-green-600
                                        flex
                                        items-center
                                        justify-center
                                        transition
                                        group-hover:scale-110
                                    "
                                >
                                    <FileSpreadsheet size={26} />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {excelLoading
                                            ? "Menyiapkan Excel..."
                                            : "Export Excel"}
                                    </h3>

                                    <p className="text-sm text-zinc-500 mt-1">
                                        Download laporan format .xlsx
                                    </p>
                                </div>
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
                                    text-zinc-600
                                    transition
                                    group-hover:bg-green-600
                                    group-hover:text-white
                                "
                            >
                                {excelLoading ? (
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Download size={18} />
                                )}
                            </div>
                        </div>
                    </button>

                    {/* PDF BUTTON */}
                    <button
                        onClick={handleExportPdf}
                        disabled={pdfLoading || excelLoading}
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-zinc-200
                            bg-white
                            p-5
                            text-left
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:shadow-xl
                            hover:border-red-200
                            disabled:opacity-70
                            disabled:pointer-events-none
                            cursor-pointer
                        "
                    >
                        <div
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-br
                                from-red-50
                                to-transparent
                                opacity-0
                                group-hover:opacity-100
                                transition
                            "
                        />

                        <div className="relative flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className="
                                        w-14
                                        h-14
                                        rounded-2xl
                                        bg-red-100
                                        text-red-600
                                        flex
                                        items-center
                                        justify-center
                                        transition
                                        group-hover:scale-110
                                    "
                                >
                                    <FileText size={26} />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {pdfLoading
                                            ? "Menyiapkan PDF..."
                                            : "Export PDF"}
                                    </h3>

                                    <p className="text-sm text-zinc-500 mt-1">
                                        Download laporan format PDF
                                    </p>
                                </div>
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
                                    text-zinc-600
                                    transition
                                    group-hover:bg-red-600
                                    group-hover:text-white
                                "
                            >
                                {pdfLoading ? (
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Download size={18} />
                                )}
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
