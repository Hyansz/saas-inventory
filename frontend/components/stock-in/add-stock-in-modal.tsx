"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useMemo, useState } from "react";

import { ChevronDown, ListPlus } from "lucide-react";

import api from "@/lib/axios";
import { createStockIn } from "@/services/stock-in";
import { convertPreview, formatUnitName } from "@/lib/unit-format";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddStockInModal({ open, onClose, onSuccess }: Props) {
    const [items, setItems] = useState<any[]>([]);

    const [form, setForm] = useState({
        item_id: "",
        qty: "",
        unit_id: "",
        supplier: "",
        tanggal: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await api.get("/items?limit=1000");

            setItems(res.data.data);
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
        const item = items.find((i) => String(i.id) === String(itemId));

        const baseUnit =
            item?.units?.find((u: any) => u.is_base) ?? item?.units?.[0];

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

            await createStockIn({
                item_id: Number(form.item_id),
                qty_unit: Number(form.qty),
                unit_id: Number(form.unit_id),
                supplier: form.supplier,
                tanggal: form.tanggal,
            });

            onSuccess();

            onClose();

            setForm({
                item_id: "",
                qty: "",
                unit_id: "",
                supplier: "",
                tanggal: "",
            });
        } catch (err) {
            console.log(err);

            alert("Gagal stock in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="
                    w-[95vw]
                    max-w-md
                    rounded-[1rem]
                    border
                    border-zinc-200
                    p-0
                    overflow-hidden
                    gap-0
                "
            >
                {/* HEADER */}
                <div
                    className="
                        border-b
                        border-zinc-100
                        px-5
                        sm:px-6
                        py-5
                        bg-white
                    "
                >
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-2xl
                                    bg-zinc-100
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <ListPlus
                                    size={20}
                                    className="text-zinc-700"
                                />
                            </div>

                            <div>
                                <DialogTitle
                                    className="
                                        text-lg
                                        sm:text-xl
                                        font-semibold
                                        tracking-tight
                                    "
                                >
                                    Tambah Stock
                                </DialogTitle>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Tambahkan stok barang masuk ke inventory.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="
                        space-y-5
                        px-5
                        sm:px-6
                        py-5
                        sm:py-6
                    "
                >
                    <div className="grid grid-cols-2 gap-4">
                        {/* ITEM */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Nama Barang
                            </label>

                            <div className="relative mt-2">
                                <select
                                    required
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
                                    transition-all
                                    focus:outline-none
                                    focus:ring-4
                                    focus:ring-zinc-200
                                    focus:bg-white
                                    cursor-pointer
                                "
                                >
                                    <option value="">
                                        Pilih barang inventory
                                    </option>

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

                        {/* SATUAN */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Satuan
                            </label>

                            <div className="relative mt-2">
                                <select
                                    required
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
                                    transition-all
                                    focus:outline-none
                                    focus:ring-4
                                    focus:ring-zinc-200
                                    focus:bg-white
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
                    </div>

                    {/* QTY */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Jumlah Barang ({selectedUnit?.nama_unit ?? "satuan"})
                        </label>

                        <input
                            required
                            type="number"
                            min="0.01"
                            step="any"
                            placeholder="Qty"
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
                                transition-all
                                focus:outline-none
                                focus:ring-4
                                focus:ring-zinc-200
                                focus:bg-white
                            "
                        />

                        {preview && (
                            <p className="text-xs text-zinc-500 mt-1.5">
                                {preview}
                            </p>
                        )}
                    </div>

                    {/* SUPPLIER */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Supplier
                        </label>

                        <input
                            required
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
                                transition-all
                                focus:outline-none
                                focus:ring-4
                                focus:ring-zinc-200
                                focus:bg-white
                            "
                        />
                    </div>

                    {/* TANGGAL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Tanggal Masuk
                        </label>

                        <input
                            required
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
                                transition-all
                                focus:outline-none
                                focus:ring-4
                                focus:ring-zinc-200
                                focus:bg-white
                            "
                        />
                    </div>

                    {/* BUTTON */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                h-12
                                rounded-2xl
                                bg-black
                                text-white
                                text-sm
                                font-medium
                                transition-all
                                hover:opacity-90
                                active:scale-[0.99]
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                cursor-pointer
                            "
                        >
                            {loading ? "Menyimpan..." : "Simpan Stock Masuk"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
