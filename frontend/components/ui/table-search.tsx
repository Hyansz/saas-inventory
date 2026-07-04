"use client";

import { Search, X } from "lucide-react";

interface Props {
    value: string;

    onChange: (value: string) => void;

    placeholder?: string;
}

export default function TableSearch({
    value,
    onChange,
    placeholder = "Cari barang",
}: Props) {
    return (
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
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
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

            {value && (
                <button
                    onClick={() => onChange("")}
                    className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            transition
                            hover:bg-zinc-200
                            cursor-pointer
                        "
                >
                    <X size={14} className="text-zinc-500" />
                </button>
            )}
        </div>
    );
}
