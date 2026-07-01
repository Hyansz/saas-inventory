"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    page: number;

    totalPages: number;

    setPage: (page: number) => void;
}

export default function TablePagination({ page, totalPages, setPage }: Props) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                rounded-[28px]
                border
                border-zinc-200
                bg-white
                p-4
            "
        >
            <p className="text-sm text-zinc-500">
                Page <span className="font-semibold text-black">{page}</span>{" "}
                dari{" "}
                <span className="font-semibold text-black">
                    {totalPages || 1}
                </span>
            </p>

            <div className="flex gap-3">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="
                        flex
                        h-11
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-zinc-200
                        px-4
                        text-sm
                        font-medium
                        transition-all
                        hover:bg-zinc-50
                        disabled:opacity-40
                    "
                >
                    <ChevronLeft size={16} />
                    Prev
                </button>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="
                        flex
                        h-11
                        items-center
                        gap-2
                        rounded-2xl
                        bg-black
                        px-4
                        text-sm
                        font-medium
                        text-white
                        transition-all
                        hover:opacity-90
                        disabled:opacity-40
                    "
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
