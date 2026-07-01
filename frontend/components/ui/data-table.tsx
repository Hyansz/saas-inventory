"use client";

import { ReactNode } from "react";

interface Header {
    label: string;
    align?: "left" | "center" | "right";
    className?: string;
}

interface Props {
    headers: Header[];
    children: ReactNode;
    empty?: ReactNode;
    loading?: boolean;
    isEmpty?: boolean;
}

export default function DataTable({
    headers,
    children,
    empty,
    loading,
    isEmpty = false,
}: Props) {
    return (
        <div
            className="
                overflow-hidden
                rounded-[2rem]
                border
                border-zinc-200
                bg-white
            "
        >
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                    {/* HEADER */}
                    <thead
                        className="
                            sticky
                            top-0
                            z-10
                        "
                    >
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header.label}
                                    className={`
                                        border-b
                                        border-zinc-200
                                        bg-zinc-50/80
                                        px-6
                                        py-4
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-zinc-500
                                        ${
                                            header.align === "right"
                                                ? "text-right"
                                                : header.align === "center"
                                                  ? "text-center"
                                                  : "text-left"
                                        }
                                        ${header.className || ""}
                                    `}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <tr key={i}>
                                    {headers.map((_, idx) => (
                                        <td key={idx} className="px-6 py-5">
                                            <div
                                                className="
                                                    h-5
                                                    w-full
                                                    overflow-hidden
                                                    rounded-xl
                                                    bg-zinc-100
                                                    relative
                                                "
                                            >
                                                <div
                                                    className="
                                                        absolute
                                                        inset-0
                                                        -translate-x-full
                                                        animate-[shimmer_1.5s_infinite]
                                                        bg-gradient-to-r
                                                        from-transparent
                                                        via-white/60
                                                        to-transparent
                                                    "
                                                />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : isEmpty ? (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    className="px-6 py-20"
                                >
                                    {empty}
                                </td>
                            </tr>
                        ) : (
                            children
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
