"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";

import { ChevronDown, Package2, LoaderCircle } from "lucide-react";

import { getCategories } from "@/services/categories";
import { createItem } from "@/services/items";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            await createItem({
                ...form,
                stok_minimal: Number(form.stok_minimal),
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
                        <label className="text-sm font-medium text-zinc-700">
                            Stock Minimal
                        </label>

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

                    {/* DESKRIPSI */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Deskripsi
                        </label>

                        <textarea
                            rows={4}
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
