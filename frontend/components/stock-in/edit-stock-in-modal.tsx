"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useMemo, useState } from "react";

import { Save, ChevronDown, FileSliders } from "lucide-react";

import { getItems } from "@/services/items";
import { updateStockIn } from "@/services/stock-in";
import { convertPreview, formatUnitName } from "@/lib/unit-format";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: any;
}

export default function EditStockInModal({
    open,
    onClose,
    onSuccess,
    item,
}: Props) {
    const [items, setItems] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        item_id: "",
        supplier: "",
        qty: "",
        unit_id: "",
        tanggal: "",
    });

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (item) {
            setForm({
                item_id: item.item_id?.toString() || "",
                supplier: item.supplier || "",
                qty: (item.qty_unit ?? item.qty)?.toString() || "",
                unit_id: item.unit_id?.toString() || "",
                tanggal: item.tanggal ? item.tanggal.split("T")[0] : "",
            });
        }
    }, [item]);

    const fetchItems = async () => {
        try {
            const res = await getItems({
                page: 1,
                limit: 9999,
            });

            setItems(res.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const selectedItem = useMemo(
        () => items.find((i) => String(i.id) === String(form.item_id)) ?? null,
        [items, form.item_id],
    );

    const baseName = formatUnitName(selectedItem);

    const handleItemChange = (itemId: string) => {
        const nextItem = items.find((i) => String(i.id) === String(itemId));

        const baseUnit =
            nextItem?.units?.find((u: any) => u.is_base) ??
            nextItem?.units?.[0];

        setForm({
            ...form,
            item_id: itemId,
            unit_id: baseUnit ? String(baseUnit.id) : "",
        });
    };

    const selectedUnit = useMemo(
        () =>
            selectedItem?.units?.find(
                (u: any) => String(u.id) === String(form.unit_id),
            ) ?? null,
        [selectedItem, form.unit_id],
    );

    const preview = convertPreview(
        Number(form.qty),
        selectedUnit,
        baseName,
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            await updateStockIn(item.id, {
                item_id: Number(form.item_id),
                qty_unit: Number(form.qty),
                unit_id: Number(form.unit_id),
                supplier: form.supplier,
                tanggal: form.tanggal,
            });

            onSuccess();

            onClose();
        } catch (error) {
            console.log(error);

            alert("Gagal update stock in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-md rounded-[1rem] p-0 overflow-hidden border-zinc-200">
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
                                <FileSliders size={20} />
                            </div>

                            <div>
                                <DialogTitle className="text-xl font-semibold tracking-tight">
                                    Edit Stock In
                                </DialogTitle>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Update data stock masuk.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* BARANG */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Barang
                            </label>

                            <div className="relative mt-2">
                                <select
                                    value={form.item_id}
                                    onChange={(e) =>
                                        handleItemChange(e.target.value)
                                    }
                                    className="
                                    w-full
                                    h-12
                                    rounded-2xl
                                    border
                                    border-zinc-200
                                    bg-zinc-50
                                    px-4
                                    pr-12
                                    text-sm
                                    appearance-none
                                    focus:outline-none
                                    focus:ring-4
                                    focus:ring-zinc-200
                                    cursor-pointer
                                "
                                >
                                    <option value="">Pilih Barang</option>

                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama_barang}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown
                                    size={18}
                                    className="
                                    pointer-events-none
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-zinc-400
                                "
                                />
                            </div>
                        </div>

                        {/* SUPPLIER */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Supplier
                            </label>

                            <input
                                type="text"
                                placeholder="Nama supplier"
                                value={form.supplier}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        supplier: e.target.value,
                                    })
                                }
                                className="
                                w-full
                                h-12
                                mt-2
                                rounded-2xl
                                border
                                border-zinc-200
                                bg-zinc-50
                                px-4
                                text-sm
                                focus:outline-none
                                focus:ring-4
                                focus:ring-zinc-200
                            "
                            />
                        </div>
                    </div>

                    {/* SATUAN */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Satuan
                        </label>

                        <div className="relative mt-2">
                            <select
                                disabled={!selectedItem}
                                value={form.unit_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        unit_id: e.target.value,
                                    })
                                }
                                className="
                                    w-full
                                    h-12
                                    rounded-2xl
                                    border
                                    border-zinc-200
                                    bg-zinc-50
                                    px-4
                                    pr-12
                                    text-sm
                                    appearance-none
                                    focus:outline-none
                                    focus:ring-4
                                    focus:ring-zinc-200
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                "
                            >
                                <option value="">
                                    {selectedItem
                                        ? "Pilih satuan"
                                        : "Pilih barang dulu"}
                                </option>

                                {selectedItem?.units?.map((unit: any) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.nama_unit}
                                        {unit.is_base ? " (dasar)" : ""}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={18}
                                className="
                                pointer-events-none
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-zinc-400
                            "
                            />
                        </div>
                    </div>

                    {/* QTY */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Qty ({selectedUnit?.nama_unit ?? "satuan"})
                        </label>

                        <input
                            type="number"
                            min="0.01"
                            step="any"
                            placeholder="Jumlah barang"
                            value={form.qty}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    qty: e.target.value,
                                })
                            }
                            className="
                                w-full
                                h-12
                                mt-2
                                rounded-2xl
                                border
                                border-zinc-200
                                bg-zinc-50
                                px-4
                                text-sm
                                focus:outline-none
                                focus:ring-4
                                focus:ring-zinc-200
                            "
                        />

                        {preview && (
                            <p className="text-xs text-zinc-500 mt-1.5">
                                {preview}
                            </p>
                        )}
                    </div>

                    {/* TANGGAL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Tanggal
                        </label>

                        <input
                            type="date"
                            value={form.tanggal}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    tanggal: e.target.value,
                                })
                            }
                            className="
                                w-full
                                h-12
                                mt-2
                                rounded-2xl
                                border
                                border-zinc-200
                                bg-zinc-50
                                px-4
                                text-sm
                                focus:outline-none
                                focus:ring-4
                                focus:ring-zinc-200
                            "
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            h-12
                            rounded-2xl
                            bg-black
                            text-sm
                            font-medium
                            text-white
                            hover:opacity-90
                            transition
                            disabled:opacity-50
                            cursor-pointer
                        "
                    >
                        {loading ? "Loading..." : "Simpan Perubahan"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
