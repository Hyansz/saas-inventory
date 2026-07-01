"use client";

import { Calendar, FolderTree } from "lucide-react";

import DataTable from "@/components/ui/data-table";
import TableEmpty from "@/components/ui/table-empty";
import TableAction from "../ui/table-action";

interface Props {
    items?: any[];
    search?: string;
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
}

export default function CategoriesTable({
    items = [],
    search = "",
    onEdit,
    onDelete,
}: Props) {
    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : {};

    const isAdmin = user.role === "admin";

    return (
        <DataTable
            isEmpty={items.length === 0}
            headers={[
                { label: "Kategori" },
                { label: "Status" },
                { label: "Tanggal Dibuat" },

                ...(isAdmin
                    ? [{ label: "Aksi", align: "right" as const }]
                    : []),
            ]}
            empty={
                <TableEmpty
                    title={
                        search
                            ? "Kategori tidak ditemukan"
                            : "Belum ada kategori"
                    }
                    description={
                        search
                            ? `Tidak ada hasil untuk "${search}"`
                            : "Kategori akan muncul di sini"
                    }
                />
            }
        >
            {items.map((item: any) => {
                const isActive = item.items_count > 0;

                return (
                    <tr
                        key={item.id}
                        className="
                        border-b
                        border-zinc-100
                        hover:bg-zinc-50/80
                        transition
                    "
                    >
                        {/* KATEGORI */}
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-zinc-100
                                "
                                >
                                    <FolderTree
                                        size={18}
                                        className="text-zinc-700"
                                    />
                                </div>

                                <div>
                                    <p className="font-semibold text-zinc-900">
                                        {item.name}
                                    </p>

                                    <p className="text-sm text-zinc-500 mt-1">
                                        ID #{item.id}
                                    </p>
                                </div>
                            </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                            {isActive ? (
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        rounded-full
                                        bg-emerald-100
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-emerald-700
                                    "
                                >
                                    Aktif
                                </span>
                            ) : (
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        rounded-full
                                        bg-zinc-100
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-zinc-600
                                    "
                                >
                                    Nonaktif
                                </span>
                            )}
                        </td>

                        {/* TANGGAL */}
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-zinc-500">
                                <Calendar size={15} />

                                <span className="text-sm">
                                    {new Date(
                                        item.created_at,
                                    ).toLocaleDateString("id-ID")}
                                </span>
                            </div>
                        </td>

                        {/* ACTION */}
                        {isAdmin && (
                            <td className="px-6 py-5 w-12 h-12">
                                <TableAction
                                    onEdit={() => onEdit?.(item)}
                                    onDelete={() => onDelete?.(item)}
                                />
                            </td>
                        )}
                    </tr>
                );
            })}
        </DataTable>
    );
}
