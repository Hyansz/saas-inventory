"use client";

import { ArrowDownLeft, Calendar, Truck } from "lucide-react";

import DataTable from "@/components/ui/data-table";
import TableEmpty from "@/components/ui/table-empty";
import TableAction from "../ui/table-action";
import MobileCardList from "@/components/ui/mobile-card-list";
import InventoryCard from "../ui/inventory-card";

interface Props {
    items?: any[];
    search?: string;
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
}

export default function StockInsTable({
    items = [],
    onEdit,
    search = "",
    onDelete,
}: Props) {
    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : {};

    const isAdmin = user.role === "admin";

    return (
        <>
            <div className="md:hidden block">
                <MobileCardList
                    items={items}
                    empty={
                        <TableEmpty
                            title={
                                search
                                    ? "Barang tidak ditemukan"
                                    : "Belum ada data stock masuk"
                            }
                            description={
                                search
                                    ? `Tidak ada hasil untuk "${search}"`
                                    : "Data stock masuk akan muncul di sini"
                            }
                        />
                    }
                    renderItem={(item) => (
                        <InventoryCard
                            title={item.item?.nama_barang}
                            subtitle={item.item?.kode_barang}
                            details={[
                                {
                                    label: "Supplier",
                                    value: item.supplier,
                                },
                                {
                                    label: "Tanggal",
                                    value: new Date(
                                        item.created_at,
                                    ).toLocaleDateString("id-ID"),
                                },
                            ]}
                            footer={
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-emerald-100
                                        px-3
                                        py-2
                                        text-xs
                                        font-semibold
                                        text-emerald-700
                                    "
                                >
                                    <ArrowDownLeft size={14} />+{item.qty}
                                </div>
                            }
                            action={
                                isAdmin ? (
                                    <TableAction
                                        onEdit={() => onEdit?.(item)}
                                        onDelete={() => onDelete?.(item)}
                                    />
                                ) : undefined
                            }
                        />
                    )}
                />
            </div>
            <div className="hidden md:block">
                <DataTable
                    isEmpty={items.length === 0}
                    headers={[
                        { label: "Barang" },
                        { label: "Supplier" },
                        { label: "Tanggal" },
                        { label: "Qty", align: "center" },

                        ...(isAdmin
                            ? [{ label: "Aksi", align: "right" as const }]
                            : []),
                    ]}
                    empty={
                        <TableEmpty
                            title={
                                search
                                    ? "Barang tidak ditemukan"
                                    : "Belum ada data stock masuk"
                            }
                            description={
                                search
                                    ? `Tidak ada hasil untuk "${search}"`
                                    : "Data stock masuk akan muncul di sini"
                            }
                        />
                    }
                >
                    {items.map((item: any) => (
                        <tr
                            key={item.id}
                            className="
                        border-b
                        border-zinc-100
                        hover:bg-zinc-50/80
                        transition
                    "
                        >
                            {/* BARANG */}
                            <td className="px-6 py-5">
                                <div>
                                    <p className="font-semibold text-zinc-900">
                                        {item.item?.nama_barang}
                                    </p>

                                    <p className="text-sm text-zinc-500 mt-1">
                                        {item.item?.kode_barang}
                                    </p>
                                </div>
                            </td>

                            {/* SUPPLIER */}
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <Truck size={15} />

                                    <span className="text-sm">
                                        {item.supplier || "-"}
                                    </span>
                                </div>
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

                            {/* QTY */}
                            <td className="px-6 py-5 text-center">
                                <div
                                    className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-emerald-100
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-emerald-700
                            "
                                >
                                    <ArrowDownLeft size={14} />+{item.qty}
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
                    ))}
                </DataTable>
            </div>
        </>
    );
}
