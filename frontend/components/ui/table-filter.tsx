"use client";

import { CalendarDays, ChevronDown, Filter, Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    search: string;
    setSearch: (value: string) => void;
    type: string;
    setType: (value: string) => void;
    date1: string;
    setDate1: (value: string) => void;
    date2: string;
    setDate2: (value: string) => void;
    onReset?: () => void;
    types?: {
        label: string;
        value: string;
    }[];
    searchPlaceholder?: string;

    // 🔥 tambahin ini dari parent (isFetching)
    loading?: boolean;
}

export default function TableFilter({
    search,
    setSearch,
    type,
    setType,
    date1,
    setDate1,
    date2,
    setDate2,
    onReset,
    types = [],
    searchPlaceholder = "Cari data...",
    loading = false,
}: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const isFiltered = type || date1 || date2;

    useEffect(() => {
        function handleClick(e: any) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <>
            {/* ================= MOBILE ================= */}
            <div className="lg:hidden space-y-3" ref={ref}>
                {/* SEARCH */}
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full h-12 rounded-2xl border bg-white pl-11"
                    />
                </div>

                {/* FILTER BUTTON */}
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="w-full h-12 rounded-2xl border bg-white flex items-center justify-center gap-2 font-medium cursor-pointer"
                >
                    <Filter size={18} />
                    Filter
                    {isFiltered && (
                        <span className="w-2 h-2 rounded-full bg-black" />
                    )}
                    <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={16} />
                    </motion.div>
                </button>

                {/* DROPDOWN */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{
                                duration: 0.2,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="bg-white border rounded-2xl p-4 shadow-lg space-y-4 origin-top"
                        >
                            {/* TYPE */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-500">
                                    Tipe Transaksi
                                </label>

                                <div className="relative mt-2">
                                    <select
                                        value={type}
                                        onChange={(e) =>
                                            setType(e.target.value)
                                        }
                                        className="
                                            w-full
                                            h-12
                                            rounded-2xl
                                            border
                                            bg-zinc-50
                                            px-4
                                            pr-10
                                            appearance-none
                                            transition-all
                                            focus:ring-2
                                            focus:ring-black/10
                                            focus:bg-white
                                        "
                                    >
                                        <option value="">Semua</option>
                                        {types.map((x) => (
                                            <option
                                                key={x.value}
                                                value={x.value}
                                            >
                                                {x.label}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown
                                        size={18}
                                        className="
                                            pointer-events-none
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-zinc-400
                                        "
                                    />
                                </div>
                            </div>

                            <DateInput
                                label="Dari"
                                value={date1}
                                setValue={setDate1}
                            />

                            <DateInput
                                label="Sampai"
                                value={date2}
                                setValue={setDate2}
                            />

                            {/* ACTION */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => onReset?.()}
                                    className="flex-1 h-10 rounded-xl border text-sm"
                                >
                                    Reset
                                </button>

                                <button
                                    onClick={() => setOpen(false)}
                                    className="flex-1 h-10 rounded-xl bg-black text-white text-sm"
                                >
                                    Terapkan
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 🔥 SKELETON RESULT */}
                {loading && <MobileSkeleton />}
            </div>

            {/* ================= DESKTOP (UNCHANGED) ================= */}
            <div className="hidden lg:block bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <Header onReset={onReset} isFiltered={!!isFiltered} />

                <FilterForm
                    {...{
                        search,
                        setSearch,
                        type,
                        setType,
                        date1,
                        setDate1,
                        date2,
                        setDate2,
                        types,
                        searchPlaceholder,
                    }}
                />
            </div>
        </>
    );
}

/* ================= SKELETON ================= */

function MobileSkeleton() {
    return (
        <div className="space-y-3 mt-3">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="h-16 rounded-2xl bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 animate-pulse"
                />
            ))}
        </div>
    );
}

/* ================= UI ================= */

function Header({
    isFiltered,
    onReset,
}: {
    isFiltered: boolean;
    onReset?: () => void;
}) {
    return (
        <div className="flex justify-between items-center mb-5">
            <div className="flex gap-2 items-center">
                <Filter size={18} />
                <h2 className="font-semibold">Filter Data</h2>
            </div>

            {isFiltered && (
                <button
                    onClick={onReset}
                    className="text-sm flex gap-2 items-center text-zinc-500 hover:text-black cursor-pointer"
                >
                    <X size={15} />
                    Hapus Filter
                </button>
            )}
        </div>
    );
}

function FilterForm(props: any) {
    const {
        search,
        setSearch,
        type,
        setType,
        date1,
        setDate1,
        date2,
        setDate2,
        types,
        searchPlaceholder,
    } = props;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div>
                <label className="text-xs font-semibold text-zinc-500">
                    Cari Barang
                </label>

                <div className="relative mt-2">
                    {/* ICON SEARCH */}
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    />

                    {/* INPUT */}
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="
                            w-full
                            h-12
                            rounded-2xl
                            border
                            bg-zinc-50
                            pl-11
                            pr-11   /* kasih space buat X */
                            focus:ring-2
                            focus:ring-black/10
                            focus:bg-white
                        "
                    />

                    {/* CLEAR BUTTON */}
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                w-7
                                h-7
                                rounded-full
                                flex
                                items-center
                                justify-center
                                hover:bg-zinc-200
                                transition
                                cursor-pointer
                            "
                        >
                            <X size={14} className="text-zinc-500" />
                        </button>
                    )}
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold text-zinc-500">
                    Tipe Transaksi
                </label>

                <div className="relative mt-2">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="
                            w-full
                            h-12
                            rounded-2xl
                            border
                            px-4
                            pr-10   /* kasih ruang buat icon */
                            bg-zinc-50
                            outline-none
                            transition-all
                            focus:border-zinc-300
                            focus:bg-white
                            focus:ring-4
                            focus:ring-zinc-100
                            appearance-none
                            cursor-pointer
                        "
                    >
                        <option value="">Semua</option>
                        {types.map((x: any) => (
                            <option key={x.value} value={x.value}>
                                {x.label}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        size={18}
                        className="
                            pointer-events-none
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-zinc-400
                        "
                    />
                </div>
            </div>

            <DateInput label="Dari Tanggal" value={date1} setValue={setDate1} />
            <DateInput
                label="Sampai Tanggal"
                value={date2}
                setValue={setDate2}
            />
        </div>
    );
}

function DateInput({ label, value, setValue }: any) {
    return (
        <div>
            <label className="text-xs font-semibold text-zinc-500">
                {label}
            </label>

            <input
                type="date"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-2 w-full h-12 rounded-2xl border px-4 bg-zinc-50"
            />
        </div>
    );
}
