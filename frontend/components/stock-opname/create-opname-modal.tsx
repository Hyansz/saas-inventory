"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";

import { CalendarPlus, LoaderCircle } from "lucide-react";

import { createStockOpname } from "@/services/stock-opname";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateOpnameModal({ open, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        tanggal: "",
        catatan: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            await createStockOpname({
                tanggal: form.tanggal,
                catatan: form.catatan || null,
            });

            onSuccess();

            onClose();

            setForm({ tanggal: "", catatan: "" });
        } catch (error) {
            console.log(error);

            alert("Gagal buat opname");
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
                    overflow-hidden
                    gap-0
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
                                <CalendarPlus size={20} className="text-zinc-700" />
                            </div>

                            <div>
                                <DialogTitle className="text-xl font-semibold tracking-tight">
                                    Buat Stock Opname
                                </DialogTitle>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Stok sistem di-snapshot otomatis untuk semua
                                    barang.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Tanggal Opname
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
                                focus:outline-none
                                focus:ring-4
                                focus:ring-zinc-200
                            "
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Catatan
                        </label>

                        <textarea
                            rows={3}
                            placeholder="Catatan opname (opsional)..."
                            value={form.catatan}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    catatan: e.target.value,
                                })
                            }
                            className="
                                w-full
                                mt-2
                                resize-none
                                rounded-2xl
                                border
                                border-zinc-200
                                bg-zinc-50
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-zinc-300
                                focus:bg-white
                                focus:ring-4
                                focus:ring-zinc-100
                            "
                        />
                    </div>

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

                        {loading ? "Membuat..." : "Buat Opname"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
