"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";

import {
    ChevronDown,
    Package2,
    LoaderCircle,
    Plus,
    Trash2,
} from "lucide-react";

import { getCategories } from "@/services/categories";
import { createItem } from "@/services/items";

interface UnitRow {
    nama_unit: string;
    konversi: string;
    is_base: boolean;
}

const UNIT_OPTIONS = ["pcs", "pack/box", "karton"];

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddItemModal({ open, onClose, onSuccess }: Props) {
    const [categories, setCategories] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        category_id: "",
        kode_barang: "",
        nama_barang: "",
        stok_minimal: "",
        deskripsi: "",
    });

    const [units, setUnits] = useState<UnitRow[]>([
        { nama_unit: "", konversi: "1", is_base: true },
    ]);

    useEffect(() => {
        if (open) {
            fetchCategories();
        }
    }, [open]);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();

            setCategories(response);
        } catch (error) {
            console.log(error);
        }
    };

    const baseUnitName =
        units.find((u) => u.is_base)?.nama_unit || "satuan dasar";

    const updateUnit = (index: number, patch: Partial<UnitRow>) => {
        setUnits((prev) =>
            prev.map((u, i) => (i === index ? { ...u, ...patch } : u)),
        );
    };

    const setBaseUnit = (index: number) => {
        setUnits((prev) =>
            prev.map((u, i) => ({
                ...u,
                is_base: i === index,
                konversi: i === index ? "1" : u.konversi,
            })),
        );
    };

    const addUnitRow = () => {
        setUnits((prev) => [
            ...prev,
            { nama_unit: "", konversi: "1", is_base: false },
        ]);
    };

    const removeUnitRow = (index: number) => {
        setUnits((prev) => {
            const next = prev.filter((_, i) => i !== index);

            if (prev[index].is_base && next.length > 0) {
                next[0].is_base = true;
                next[0].konversi = "1";
            }

            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (units.filter((u) => u.is_base).length !== 1) {
            alert("Pilih tepat satu satuan dasar");
            return;
        }

        if (units.some((u) => !u.nama_unit.trim())) {
            alert("Nama satuan tidak boleh kosong");
            return;
        }

        try {
            setLoading(true);

            await createItem({
                ...form,
                stok_minimal: Number(form.stok_minimal),
                units: units.map((u) => ({
                    nama_unit: u.nama_unit.trim(),
                    konversi: Number(u.konversi),
                    is_base: u.is_base,
                })),
            });

            onSuccess();

            onClose();

            setForm({
                category_id: "",
                kode_barang: "",
                nama_barang: "",
                stok_minimal: "",
                deskripsi: "",
            });

            setUnits([
                { nama_unit: "", konversi: "1", is_base: true },
            ]);
        } catch (error) {
            console.log(error);

            alert("Gagal tambah barang");
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
                    bg-white
                    p-0
                    gap-0
                    max-h-[90dvh]
                    overflow-hidden
                "
            >
                <div
                    className="
                        pointer-events-none
                        absolute
                        top-[72px]
                        left-0
                        right-0
                        h-8
                        bg-gradient-to-b
                        from-white
                        to-transparent
                        z-10
                    "
                />
                {/* HEADER */}
                <div className="border-b border-zinc-100 px-6 py-5">
                    <DialogHeader>
                        <div className="flex items-center gap-4">
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-zinc-100
                                "
                            >
                                <Package2 size={20} className="text-zinc-700" />
                            </div>

                            <div>
                                <DialogTitle
                                    className="
                                        text-xl
                                        font-semibold
                                        tracking-tight
                                    "
                                >
                                    Tambah Barang
                                </DialogTitle>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Tambahkan inventory baru.
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
                        px-6
                        py-6

                        overflow-y-auto
                        max-h-[calc(90dvh-100px)]

                        scrollbar-thin
                        scrollbar-thumb-zinc-300
                        scrollbar-track-transparent
                    "
                >
                    <div className="grid grid-cols-2 gap-4">
                        {/* CATEGORY */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Kategori
                            </label>

                            <div className="relative mt-2">
                                <select
                                    required
                                    value={form.category_id}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            category_id: e.target.value,
                                        })
                                    }
                                    className="
                                        h-12
                                        w-full
                                        appearance-none
                                        rounded-2xl
                                        border
                                        border-zinc-200
                                        bg-zinc-50
                                        px-4
                                        pr-11
                                        text-sm
                                        outline-none
                                        transition-all
                                        focus:border-zinc-300
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-zinc-100
                                        cursor-pointer
                                    "
                                >
                                    <option value="">Pilih kategori</option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
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

                        {/* KODE */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Kode Barang
                            </label>

                            <input
                                required
                                type="text"
                                placeholder="BRG-001"
                                value={form.kode_barang}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        kode_barang: e.target.value,
                                    })
                                }
                                className="
                                mt-2
                                h-12
                                w-full
                                rounded-2xl
                                border
                                border-zinc-200
                                bg-zinc-50
                                px-4
                                text-sm
                                outline-none
                                transition-all
                                focus:border-zinc-300
                                focus:bg-white
                                focus:ring-4
                                focus:ring-zinc-100
                            "
                            />
                        </div>
                    </div>

                    {/* NAMA */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Nama Barang
                        </label>

                        <input
                            required
                            type="text"
                            placeholder="Masukkan nama barang"
                            value={form.nama_barang}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    nama_barang: e.target.value,
                                })
                            }
                            className="
                                mt-2
                                h-12
                                w-full
                                rounded-2xl
                                border
                                border-zinc-200
                                bg-zinc-50
                                px-4
                                text-sm
                                outline-none
                                transition-all
                                focus:border-zinc-300
                                focus:bg-white
                                focus:ring-4
                                focus:ring-zinc-100
                            "
                        />
                    </div>

                    {/* STOK */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-700">
                                Stock Minimal
                            </label>

                            <span className="text-xs text-zinc-400">
                                dalam satuan: {baseUnitName}
                            </span>
                        </div>

                        <input
                            required
                            type="number"
                            placeholder="10"
                            value={form.stok_minimal}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    stok_minimal: e.target.value,
                                })
                            }
                            className="
                                mt-2
                                h-12
                                w-full
                                rounded-2xl
                                border
                                border-zinc-200
                                bg-zinc-50
                                px-4
                                text-sm
                                outline-none
                                transition-all
                                focus:border-zinc-300
                                focus:bg-white
                                focus:ring-4
                                focus:ring-zinc-100
                            "
                        />
                    </div>

                    {/* SATUAN */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-700">
                                Satuan Barang
                            </label>

                            <button
                                type="button"
                                onClick={addUnitRow}
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    text-xs
                                    font-semibold
                                    text-zinc-600
                                    hover:text-black
                                    transition-colors
                                    cursor-pointer
                                "
                            >
                                <Plus size={14} />
                                Tambah Satuan
                            </button>
                        </div>

                        {units.map((unit, index) => (
                            <div
                                key={index}
                                className="
                                    rounded-2xl
                                    border
                                    border-zinc-200
                                    bg-zinc-50/60
                                    p-3
                                    space-y-3
                                "
                            >
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 cursor-pointer shrink-0">
                                        <input
                                            type="radio"
                                            checked={unit.is_base}
                                            onChange={() =>
                                                setBaseUnit(index)
                                            }
                                            className="accent-zinc-900"
                                        />
                                        Dasar
                                    </label>

                                    {units.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeUnitRow(index)
                                            }
                                            className="
                                                ml-auto
                                                text-zinc-400
                                                hover:text-red-500
                                                transition-colors
                                                cursor-pointer
                                            "
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <select
                                            required
                                            value={unit.nama_unit}
                                            onChange={(e) =>
                                                updateUnit(index, {
                                                    nama_unit: e.target.value,
                                                })
                                            }
                                            className="
                                                h-11
                                                w-full
                                                appearance-none
                                                rounded-xl
                                                border
                                                border-zinc-200
                                                bg-white
                                                px-3
                                                pr-8
                                                text-sm
                                                outline-none
                                                focus:border-zinc-300
                                                focus:ring-4
                                                focus:ring-zinc-100
                                                cursor-pointer
                                            "
                                        >
                                            <option value="">
                                                Pilih satuan
                                            </option>

                                            {UNIT_OPTIONS.filter(
                                                (opt) =>
                                                    unit.nama_unit === opt ||
                                                    !units.some(
                                                        (u, j) =>
                                                            j !== index &&
                                                            u.nama_unit ===
                                                                opt,
                                                    ),
                                            ).map((opt) => (
                                                <option
                                                    key={opt}
                                                    value={opt}
                                                >
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDown
                                            size={14}
                                            className="
                                                pointer-events-none
                                                absolute
                                                right-2.5
                                                top-1/2
                                                -translate-y-1/2
                                                text-zinc-400
                                            "
                                        />
                                    </div>

                                    <div className="relative">
                                        <input
                                            required
                                            type="number"
                                            step="any"
                                            min="0.0001"
                                            disabled={unit.is_base}
                                            placeholder="1"
                                            value={unit.konversi}
                                            onChange={(e) =>
                                                updateUnit(index, {
                                                    konversi: e.target.value,
                                                })
                                            }
                                            className="
                                                h-11
                                                w-full
                                                rounded-xl
                                                border
                                                border-zinc-200
                                                bg-white
                                                px-3
                                                text-sm
                                                outline-none
                                                focus:border-zinc-300
                                                focus:ring-4
                                                focus:ring-zinc-100
                                                disabled:bg-zinc-100
                                                disabled:text-zinc-400
                                            "
                                        />

                                        {!unit.is_base && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 pointer-events-none">
                                                = 1 {baseUnitName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <p className="text-xs text-zinc-400">
                            Satuan dasar bebas dipilih (tidak harus pcs).
                            Konversi = jumlah satuan dasar dalam 1 satuan ini.
                        </p>
                    </div>

                    {/* DESKRIPSI */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Deskripsi
                        </label>

                        <textarea
                            rows={3}
                            placeholder="Tambahkan deskripsi barang..."
                            value={form.deskripsi}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    deskripsi: e.target.value,
                                })
                            }
                            className="
                                mt-2
                                w-full
                                resize-none
                                rounded-2xl
                                border
                                border-zinc-200
                                bg-zinc-50
                                px-4
                                py-3
                                text-sm
                                outline-none
                                transition-all
                                focus:border-zinc-300
                                focus:bg-white
                                focus:ring-4
                                focus:ring-zinc-100
                            "
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
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
                        {loading && (
                            <LoaderCircle size={16} className="animate-spin" />
                        )}

                        {loading ? "Menyimpan..." : "Tambah Barang"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
