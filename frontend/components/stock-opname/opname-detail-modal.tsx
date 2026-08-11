"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useMemo, useState } from "react";

import { ClipboardList, LoaderCircle } from "lucide-react";

import StatusBadge from "@/components/ui/status-badge";
import {
    completeStockOpname,
    getStockOpname,
} from "@/services/stock-opname";
import { formatUnitName } from "@/lib/unit-format";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    opnameId: number | null;
}

export default function OpnameDetailModal({
    open,
    onClose,
    onSuccess,
    opnameId,
}: Props) {
    const [detail, setDetail] = useState<any>(null);

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [rows, setRows] = useState<Record<string, any>>({});

    useEffect(() => {
        if (open && opnameId) {
            setLoading(true);

            getStockOpname(opnameId)
                .then((res) => {
                    setDetail(res.data ?? res);

                    const initial: Record<string, any> = {};

                    (res.data?.items ?? res.items ?? []).forEach(
                        (item: any) => {
                            initial[item.id] = {
                                qty_fisik:
                                    item.qty_fisik?.toString() ?? "",
                                alasan: item.alasan ?? "",
                            };
                        },
                    );

                    setRows(initial);
                })
                .catch((err) => console.log(err))
                .finally(() => setLoading(false));
        }
    }, [open, opnameId]);

    const items = detail?.items ?? [];

    const isCompleted = detail?.status === "completed";

    const selisihTotal = useMemo(() => {
        return items.reduce((acc: number, item: any) => {
            const qtyFisik = Number(rows[item.id]?.qty_fisik);
            const selisih = Number.isNaN(qtyFisik)
                ? 0
                : qtyFisik - item.qty_sistem;

            return acc + selisih;
        }, 0);
    }, [items, rows]);

    const hasMissingReason = useMemo(() => {
        return items.some((item: any) => {
            const qtyFisik = Number(rows[item.id]?.qty_fisik);
            const selisih = Number.isNaN(qtyFisik)
                ? 0
                : qtyFisik - item.qty_sistem;

            return selisih !== 0 && !rows[item.id]?.alasan?.trim();
        });
    }, [items, rows]);

    const updateRow = (id: number, patch: any) => {
        setRows((prev) => ({
            ...prev,
            [id]: { ...(prev[id] ?? {}), ...patch },
        }));
    };

    const handleComplete = async () => {
        if (!opnameId) return;

        if (hasMissingReason) {
            alert("Alasan wajib diisi untuk setiap barang yang ada selisih");
            return;
        }

        try {
            setSaving(true);

            const payload = items.map((item: any) => ({
                stock_opname_item_id: item.id,
                qty_fisik: Number(rows[item.id]?.qty_fisik ?? 0),
                alasan: rows[item.id]?.alasan || null,
            }));

            await completeStockOpname(opnameId, { items: payload });

            onSuccess();

            onClose();
        } catch (err: any) {
            console.log(err);

            alert(
                err.response?.data?.message || "Gagal menyelesaikan opname",
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="
                    w-[95vw]
                    max-w-3xl
                    rounded-[1rem]
                    border
                    border-zinc-200
                    bg-white
                    p-0
                    overflow-hidden
                    gap-0
                    max-h-[90dvh]
                "
            >
                {/* HEADER */}
                <div className="border-b border-zinc-100 px-6 py-5">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-zinc-100
                                "
                            >
                                <ClipboardList
                                    size={20}
                                    className="text-zinc-700"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <DialogTitle className="text-xl font-semibold tracking-tight">
                                    Detail Stock Opname
                                </DialogTitle>

                                <p className="mt-1 text-sm text-zinc-500 truncate">
                                    {detail?.tanggal
                                        ? new Date(
                                              detail.tanggal,
                                          ).toLocaleDateString("id-ID")
                                        : ""}{" "}
                                    · {items.length} barang · oleh{" "}
                                    {detail?.user?.name ?? "-"}
                                </p>
                            </div>

                            {detail && (
                                <StatusBadge
                                    variant={
                                        isCompleted ? "success" : "warning"
                                    }
                                >
                                    {isCompleted ? "Selesai" : "Draft"}
                                </StatusBadge>
                            )}
                        </div>
                    </DialogHeader>
                </div>

                {/* BODY */}
                <div
                    className="
                        overflow-y-auto
                        max-h-[calc(90dvh-180px)]
                    "
                >
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <LoaderCircle
                                size={24}
                                className="animate-spin text-zinc-400"
                            />
                        </div>
                    ) : (
                        <div className="px-6 py-5 space-y-4">
                            {/* DESKTOP */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs text-zinc-400 uppercase tracking-wide">
                                            <th className="pb-3 pr-4">
                                                Barang
                                            </th>
                                            <th className="pb-3 pr-4 text-center">
                                                Stok Sistem
                                            </th>
                                            <th className="pb-3 pr-4 text-center">
                                                Stok Fisik
                                            </th>
                                            <th className="pb-3 pr-4 text-center">
                                                Selisih
                                            </th>
                                            <th className="pb-3">
                                                Alasan
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {items.map((item: any) => {
                                            const baseName = formatUnitName(
                                                item.item,
                                            );

                                            const qtyFisik = Number(
                                                rows[item.id]?.qty_fisik,
                                            );

                                            const selisih = Number.isNaN(
                                                qtyFisik,
                                            )
                                                ? 0
                                                : qtyFisik -
                                                  item.qty_sistem;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="border-t border-zinc-100"
                                                >
                                                    <td className="py-3 pr-4">
                                                        <p className="font-semibold text-zinc-900">
                                                            {item.item
                                                                ?.nama_barang}
                                                        </p>

                                                        <p className="text-xs text-zinc-500 mt-0.5">
                                                            {item.item
                                                                ?.kode_barang}
                                                        </p>
                                                    </td>

                                                    <td className="py-3 pr-4 text-center">
                                                        <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                                                            {item.qty_sistem}{" "}
                                                            {baseName}
                                                        </span>
                                                    </td>

                                                    <td className="py-3 pr-4 text-center">
                                                        {isCompleted ? (
                                                            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                                {item.qty_fisik}{" "}
                                                                {baseName}
                                                            </span>
                                                        ) : (
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="1"
                                                                value={
                                                                    rows[
                                                                        item.id
                                                                    ]
                                                                        ?.qty_fisik ??
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateRow(
                                                                        item.id,
                                                                        {
                                                                            qty_fisik:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                className="
                                                                    w-24
                                                                    h-10
                                                                    rounded-xl
                                                                    border
                                                                    border-zinc-200
                                                                    bg-zinc-50
                                                                    px-3
                                                                    text-center
                                                                    text-sm
                                                                    focus:outline-none
                                                                    focus:ring-4
                                                                    focus:ring-zinc-200
                                                                "
                                                            />
                                                        )}
                                                    </td>

                                                    <td className="py-3 pr-4 text-center">
                                                        <span
                                                            className={`
                                                                inline-flex
                                                                rounded-full
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                ${
                                                                    selisih > 0
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : selisih <
                                                                          0
                                                                          ? "bg-red-100 text-red-700"
                                                                          : "bg-zinc-100 text-zinc-500"
                                                                }
                                                            `}
                                                        >
                                                            {selisih > 0
                                                                ? `+${selisih}`
                                                                : selisih}
                                                        </span>
                                                    </td>

                                                    <td className="py-3">
                                                        {isCompleted ? (
                                                            <span className="text-xs text-zinc-500">
                                                                {item.alasan ||
                                                                    "-"}
                                                            </span>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                placeholder={
                                                                    selisih !==
                                                                    0
                                                                        ? "Wajib diisi"
                                                                        : "Opsional"
                                                                }
                                                                value={
                                                                    rows[
                                                                        item.id
                                                                    ]
                                                                        ?.alasan ??
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateRow(
                                                                        item.id,
                                                                        {
                                                                            alasan:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                className={`
                                                                    w-full
                                                                    h-10
                                                                    rounded-xl
                                                                    border
                                                                    px-3
                                                                    text-sm
                                                                    focus:outline-none
                                                                    focus:ring-4
                                                                    focus:ring-zinc-200
                                                                    ${
                                                                        selisih !==
                                                                            0 &&
                                                                        !rows[
                                                                            item
                                                                                .id
                                                                        ]
                                                                            ?.alasan
                                                                            ?.trim()
                                                                            ? "border-red-300 bg-red-50"
                                                                            : "border-zinc-200 bg-zinc-50"
                                                                    }
                                                                `}
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* MOBILE */}
                            <div className="md:hidden space-y-3">
                                {items.map((item: any) => {
                                    const baseName = formatUnitName(item.item);

                                    const qtyFisik = Number(
                                        rows[item.id]?.qty_fisik,
                                    );

                                    const selisih = Number.isNaN(qtyFisik)
                                        ? 0
                                        : qtyFisik - item.qty_sistem;

                                    return (
                                        <div
                                            key={item.id}
                                            className="
                                                rounded-2xl
                                                border
                                                border-zinc-100
                                                p-4
                                                space-y-3
                                            "
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm truncate">
                                                        {item.item?.nama_barang}
                                                    </p>

                                                    <p className="text-xs text-zinc-500 mt-0.5">
                                                        {item.item?.kode_barang}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`
                                                        shrink-0
                                                        rounded-full
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-semibold
                                                        ${
                                                            selisih > 0
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : selisih < 0
                                                                  ? "bg-red-100 text-red-700"
                                                                  : "bg-zinc-100 text-zinc-500"
                                                        }
                                                    `}
                                                >
                                                    {selisih > 0
                                                        ? `+${selisih}`
                                                        : selisih}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-xs text-zinc-400 mb-1">
                                                        Stok Sistem
                                                    </p>

                                                    <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700">
                                                        {item.qty_sistem}{" "}
                                                        {baseName}
                                                    </span>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-zinc-400 mb-1">
                                                        Stok Fisik
                                                    </p>

                                                    {isCompleted ? (
                                                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                                            {item.qty_fisik}{" "}
                                                            {baseName}
                                                        </span>
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            value={
                                                                rows[
                                                                    item.id
                                                                ]?.qty_fisik ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                updateRow(
                                                                    item.id,
                                                                    {
                                                                        qty_fisik:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    },
                                                                )
                                                            }
                                                            className="
                                                                w-full
                                                                h-9
                                                                rounded-xl
                                                                border
                                                                border-zinc-200
                                                                bg-zinc-50
                                                                px-3
                                                                text-sm
                                                                text-center
                                                                focus:outline-none
                                                                focus:ring-4
                                                                focus:ring-zinc-200
                                                            "
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs text-zinc-400 mb-1">
                                                    Alasan
                                                </p>

                                                {isCompleted ? (
                                                    <span className="text-xs text-zinc-500">
                                                        {item.alasan || "-"}
                                                    </span>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        placeholder={
                                                            selisih !== 0
                                                                ? "Wajib diisi"
                                                                : "Opsional"
                                                        }
                                                        value={
                                                            rows[item.id]
                                                                ?.alasan ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            updateRow(
                                                                item.id,
                                                                {
                                                                    alasan:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            )
                                                        }
                                                        className={`
                                                            w-full
                                                            h-9
                                                            rounded-xl
                                                            border
                                                            px-3
                                                            text-sm
                                                            focus:outline-none
                                                            focus:ring-4
                                                            focus:ring-zinc-200
                                                            ${
                                                                selisih !== 0 &&
                                                                !rows[
                                                                    item.id
                                                                ]?.alasan
                                                                    ?.trim()
                                                                    ? "border-red-300 bg-red-50"
                                                                    : "border-zinc-200 bg-zinc-50"
                                                            }
                                                        `}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* SUMMARY */}
                            <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                                <span className="text-sm text-zinc-600">
                                    Total Selisih
                                </span>

                                <span
                                    className={`
                                        text-sm
                                        font-bold
                                        ${
                                            selisihTotal > 0
                                                ? "text-emerald-600"
                                                : selisihTotal < 0
                                                  ? "text-red-600"
                                                  : "text-zinc-600"
                                        }
                                    `}
                                >
                                    {selisihTotal > 0
                                        ? `+${selisihTotal}`
                                        : selisihTotal}
                                </span>
                            </div>

                            {hasMissingReason && !isCompleted && (
                                <p className="text-xs text-red-500">
                                    Ada barang dengan selisih tapi alasan belum
                                    diisi — alasan wajib sebelum selesai.
                                </p>
                            )}

                            {detail?.catatan && (
                                <p className="text-xs text-zinc-500">
                                    Catatan: {detail.catatan}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                {!isCompleted && !loading && (
                    <div className="border-t border-zinc-100 px-6 py-4">
                        <button
                            type="button"
                            onClick={handleComplete}
                            disabled={saving}
                            className="
                                flex
                                h-12
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                bg-black
                                text-sm
                                font-medium
                                text-white
                                transition-all
                                hover:opacity-90
                                disabled:opacity-50
                                cursor-pointer
                            "
                        >
                            {saving && (
                                <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                />
                            )}

                            {saving
                                ? "Menyelesaikan..."
                                : "Selesaikan Opname (catat adjustment)"}
                        </button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
