"use client";

import TableSearch from "./table-search";
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
                "
            >
                {/* SEARCH */}
                <div className="w-full xl:flex-1">
                    <TableSearch
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                        }}
                        placeholder="Cari nama barang..."
                    />
                </div>

                {/* FILTER */}

                <div className="flex shrink-0 items-center gap-2 overflow-x-auto scrollbar-hide">
                    <FilterButton
                        active={filter === "all"}
                        onClick={() => {
                            setFilter("all");
                        }}
                    >
                        Semua Barang
                    </FilterButton>

                    <FilterButton
                        active={filter === "safe"}
                        onClick={() => {
                            setFilter("safe");
                        }}
                    >
                        Stock Aman
                    </FilterButton>

                    <FilterButton
                        active={filter === "warning"}
                        onClick={() => {
                            setFilter("warning");
                        }}
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
                duration-300
                transition-all
                cursor-pointer
                ${
                    active
                        ? `
                            border
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
