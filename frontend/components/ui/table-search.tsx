"use client";

import { Search } from "lucide-react";

interface Props {
    value: string;

    onChange: (value: string) => void;

    placeholder?: string;
}

export default function TableSearch({
    value,
    onChange,
    placeholder = "Cari data...",
}: Props) {
    return (
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
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="
                        h-12
                        w-full
                        rounded-2xl
                        border
                        border-zinc-200
                        bg-zinc-50
                        pl-11
                        pr-4
                        text-sm
                        transition-all
                        focus:outline-none
                        focus:ring-4
                        focus:ring-zinc-200
                    "
                />
            </div>
        </div>
    );
}
