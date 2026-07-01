"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";

import { Save, ChevronDown, FileSliders } from "lucide-react";

import { getItems } from "@/services/items";
import { updateStockOut } from "@/services/stock-out";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: any;
}

export default function EditStockOutModal({
    open,
    onClose,
    onSuccess,
    item,
}: Props) {
    const [items, setItems] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        item_id: "",
        tujuan: "",
        qty: "",
        tanggal: "",
    });

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (item) {
            setForm({
                item_id: item.item_id?.toString() || "",
                tujuan: item.tujuan || "",
                qty: item.qty?.toString() || "",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            await updateStockOut(item.id, {
                item_id: Number(form.item_id),
                qty: Number(form.qty),
                tujuan: form.tujuan,
                tanggal: form.tanggal,
            });

            onSuccess();

            onClose();
        } catch (error) {
            console.log(error);

            alert("Gagal update stock out");
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
                                    Edit Stock Out
                                </DialogTitle>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Update data stock keluar.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* BARANG */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Barang
                            </label>

                            <div className="relative mt-2">
                                <select
                                    value={form.item_id}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            item_id: e.target.value,
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

                        {/* TUJUAN */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Tujuan
                            </label>

                            <input
                                type="text"
                                placeholder="Tujuan barang keluar"
                                value={form.tujuan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        tujuan: e.target.value,
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

                    {/* QTY */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Qty</label>

                        <input
                            type="number"
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
                    </div>

                    {/* TANGGAL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tanggal</label>

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
