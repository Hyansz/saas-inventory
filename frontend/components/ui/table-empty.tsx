"use client";

import { Boxes } from "lucide-react";

interface Props {
    title?: string;

    description?: string;

    icon?: React.ReactNode;
}

export default function TableEmpty({
    title = "Tidak ada data",
    description = "Belum ada data tersedia.",
    icon,
}: Props) {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div
                className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-3xl
                    bg-zinc-100
                "
            >
                {icon || <Boxes size={28} className="text-zinc-400" />}
            </div>

            <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {title}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-zinc-500">{description}</p>
        </div>
    );
}
