"use client";

import { Search } from "lucide-react";

interface Props {
    search: string;

    setSearch: (value: string) => void;

    filter: string;

    setFilter: (value: string) => void;
}

export default function TableStock({
    search,
    setSearch,
    filter,
    setFilter,
}: Props) {
    return (
        <div
            className="
                            sticky
                            top-4
                            z-20
                            rounded-[2rem]
                            border
                            border-zinc-200/80
                            bg-white/80
                            p-4
                            shadow-sm
                            backdrop-blur-xl
                        "
        >
            <div
                className="
                                flex
                                flex-col
                                gap-4
                                xl:flex-row
                                xl:items-center
                                xl:justify-between
                            "
            >
                {/* SEARCH */}

                <div className="relative flex-1 max-w-2xl">
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
                        type="text"
                        placeholder="Cari nama barang..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                                        h-12
                                        w-full
                                        rounded-2xl
                                        border
                                        border-zinc-200
                                        bg-zinc-50/80
                                        pl-11
                                        pr-4
                                        text-sm
                                        transition-all
                                        focus:border-zinc-300
                                        focus:bg-white
                                        focus:outline-none
                                        focus:ring-4
                                        focus:ring-zinc-200/70
                                    "
                    />
                </div>

                {/* FILTER */}

                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    <FilterButton
                        active={filter === "all"}
                        onClick={() => setFilter("all")}
                    >
                        Semua Barang
                    </FilterButton>

                    <FilterButton
                        active={filter === "safe"}
                        onClick={() => setFilter("safe")}
                    >
                        Stock Aman
                    </FilterButton>

                    <FilterButton
                        active={filter === "warning"}
                        onClick={() => setFilter("warning")}
                    >
                        Restock
                    </FilterButton>
                </div>
            </div>
        </div>
    );
}

/* FILTER */

function FilterButton({ active, children, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                inline-flex
                h-11
                items-center
                justify-center
                rounded-2xl
                px-4
                text-sm
                font-medium
                whitespace-nowrap
                transition-all
                cursor-pointer
                ${
                    active
                        ? `
                            bg-black
                            text-white
                            shadow-lg
                            shadow-black/10
                        `
                        : `
                            border
                            border-zinc-200
                            bg-white
                            text-zinc-600
                            hover:bg-zinc-50
                        `
                }
            `}
        >
            {children}
        </button>
    );
}
