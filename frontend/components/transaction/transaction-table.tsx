"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import DataTable from "@/components/ui/data-table";
import TableEmpty from "@/components/ui/table-empty";

interface Props {
    transactions?: any[];
    search?: string;
    loading?: boolean;
    fetching?: boolean;
}

export default function TransactionsTable({
    transactions = [],
    search = "",
    loading = false,
    fetching = false,
}: Props) {
    return (
        <>
            {/* DESKTOP */}
            <div className="hidden lg:block">
                <DataTable
                    loading={loading || fetching}
                    isEmpty={transactions.length === 0}
                    headers={[
                        { label: "Tanggal" },
                        { label: "Barang" },
                        { label: "Tipe" },
                        { label: "Qty" },
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
                    {transactions.map((trx: any) => (
                        <tr
                            key={trx.id}
                            className="
                                border-b
                                border-zinc-100
                                hover:bg-zinc-50/80
                                transition
                            "
                        >
                            {/* TANGGAL */}
                            <td className="px-6 py-5 text-sm text-zinc-600">
                                {trx.tanggal}
                            </td>

                            {/* BARANG */}
                            <td className="px-6 py-5">
                                <p className="font-medium text-zinc-900">
                                    {trx.item?.nama_barang}
                                </p>
                            </td>

                            {/* TIPE */}
                            <td className="px-6 py-5">
                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        ${
                                            trx.type === "IN"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }
                                    `}
                                >
                                    {trx.type === "IN" ? (
                                        <ArrowDownLeft size={14} />
                                    ) : (
                                        <ArrowUpRight size={14} />
                                    )}

                                    {trx.type === "IN" ? "Masuk" : "Keluar"}
                                </span>
                            </td>

                            {/* QTY */}
                            <td
                                className={`
                                    px-6
                                    py-5
                                    font-bold
                                    ${
                                        trx.type === "IN"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }
                                `}
                            >
                                {trx.type === "IN"
                                    ? `+${trx.qty}`
                                    : `-${trx.qty}`}
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>

            {/* MOBILE */}
            <div className="lg:hidden space-y-4">
                {transactions.length === 0 ? (
                    <div
                        className="
                            bg-white
                            border
                            rounded-3xl
                            py-14
                            text-center
                            text-zinc-500
                        "
                    >
                        <TableEmpty
                            title="Barang tidak ditemukan"
                            description={`Tidak ada hasil untuk "${search}"`}
                        />
                    </div>
                ) : (
                    transactions.map((trx: any) => (
                        <div
                            key={trx.id}
                            className="
                                bg-white
                                border
                                rounded-3xl
                                p-5
                                shadow-sm
                            "
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-zinc-500 mb-1">
                                        {trx.tanggal}
                                    </p>

                                    <h3 className="font-semibold text-base">
                                        {trx.item?.nama_barang}
                                    </h3>
                                </div>

                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-1
                                        px-3
                                        py-1.5
                                        rounded-full
                                        text-xs
                                        font-semibold
                                        ${
                                            trx.type === "IN"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }
                                    `}
                                >
                                    {trx.type === "IN" ? (
                                        <ArrowDownLeft size={14} />
                                    ) : (
                                        <ArrowUpRight size={14} />
                                    )}

                                    {trx.type === "IN" ? "Masuk" : "Keluar"}
                                </span>
                            </div>

                            <div className="mt-5 flex items-center justify-between">
                                <p className="text-sm text-zinc-500">Jumlah</p>

                                <p
                                    className={`
                                        text-xl
                                        font-bold
                                        ${
                                            trx.type === "IN"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    `}
                                >
                                    {trx.type === "IN"
                                        ? `+${trx.qty}`
                                        : `-${trx.qty}`}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
