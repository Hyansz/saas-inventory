"use client";

import { Calendar, Eye, Trash2, Users } from "lucide-react";

import DataTable from "@/components/ui/data-table";
import TableEmpty from "@/components/ui/table-empty";
import StatusBadge from "@/components/ui/status-badge";
import MobileCardList from "@/components/ui/mobile-card-list";

interface Props {
    items?: any[];
    onDetail?: (opname: any) => void;
    onDelete?: (opname: any) => void;
}

export default function OpnameTable({ items = [], onDetail, onDelete }: Props) {
    const canDelete = (opname: any) =>
        opname.status !== "completed" && onDelete;

    return (
        <>
            <div className="md:hidden block">
                <MobileCardList
                    items={items}
                    empty={
                        <TableEmpty
                            title="Belum ada stock opname"
                            description="Buat opname pertama untuk mulai stocktake"
                        />
                    }
                    renderItem={(opname) => (
                        <div
                            className="
                                rounded-2xl
                                border
                                border-zinc-100
                                bg-white
                                p-4
                                space-y-3
                            "
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-sm">
                                        {new Date(
                                            opname.tanggal,
                                        ).toLocaleDateString("id-ID")}
                                    </p>

                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {opname.items_count} barang
                                    </p>
                                </div>

                                <StatusBadge
                                    variant={
                                        opname.status === "completed"
                                            ? "success"
                                            : "warning"
                                    }
                                >
                                    {opname.status === "completed"
                                        ? "Selesai"
                                        : "Draft"}
                                </StatusBadge>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onDetail?.(opname)}
                                    className="
                                        inline-flex
                                        h-9
                                        flex-1
                                        items-center
                                        justify-center
                                        gap-1.5
                                        rounded-xl
                                        bg-zinc-100
                                        text-xs
                                        font-semibold
                                        text-zinc-700
                                        hover:bg-zinc-200
                                        transition-colors
                                        cursor-pointer
                                    "
                                >
                                    <Eye size={14} />
                                    Detail
                                </button>

                                {canDelete(opname) && (
                                    <button
                                        type="button"
                                        onClick={() => onDelete?.(opname)}
                                        className="
                                            inline-flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-red-50
                                            text-red-500
                                            hover:bg-red-100
                                            transition-colors
                                            cursor-pointer
                                        "
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                />
            </div>

            <div className="hidden md:block">
                <DataTable
                    isEmpty={items.length === 0}
                    headers={[
                        { label: "Tanggal" },
                        { label: "Dibuat Oleh" },
                        { label: "Jumlah Barang", align: "center" },
                        { label: "Status", align: "center" },
                        { label: "Aksi", align: "right" },
                    ]}
                    empty={
                        <TableEmpty
                            title="Belum ada stock opname"
                            description="Buat opname pertama untuk mulai stocktake"
                        />
                    }
                >
                    {items.map((opname: any) => (
                        <tr
                            key={opname.id}
                            className="
                                border-b
                                border-zinc-100
                                hover:bg-zinc-50/80
                                transition
                            "
                        >
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <Calendar size={15} />

                                    <span className="text-sm font-medium">
                                        {new Date(
                                            opname.tanggal,
                                        ).toLocaleDateString("id-ID")}
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <Users size={15} />

                                    <span className="text-sm">
                                        {opname.user?.name || "-"}
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-5 text-center">
                                <span className="text-sm font-semibold text-zinc-700">
                                    {opname.items_count}
                                </span>
                            </td>

                            <td className="px-6 py-5 text-center">
                                <StatusBadge
                                    variant={
                                        opname.status === "completed"
                                            ? "success"
                                            : "warning"
                                    }
                                >
                                    {opname.status === "completed"
                                        ? "Selesai"
                                        : "Draft"}
                                </StatusBadge>
                            </td>

                            <td className="px-6 py-5 text-right">
                                <div className="inline-flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onDetail?.(opname)}
                                        className="
                                            inline-flex
                                            h-9
                                            items-center
                                            justify-center
                                            gap-1.5
                                            rounded-xl
                                            bg-zinc-100
                                            px-3
                                            text-xs
                                            font-semibold
                                            text-zinc-700
                                            hover:bg-zinc-200
                                            transition-colors
                                            cursor-pointer
                                        "
                                    >
                                        <Eye size={14} />
                                        Detail
                                    </button>

                                    {canDelete(opname) && (
                                        <button
                                            type="button"
                                            onClick={() => onDelete?.(opname)}
                                            className="
                                                inline-flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-red-50
                                                text-red-500
                                                hover:bg-red-100
                                                transition-colors
                                                cursor-pointer
                                            "
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>
        </>
    );
}
