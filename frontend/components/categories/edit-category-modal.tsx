"use client";

import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { FolderPen } from "lucide-react";

import { updateCategory } from "@/services/categories";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: any;
}

export default function EditCategoryModal({
    open,
    onClose,
    onSuccess,
    item,
}: Props) {
    const [name, setName] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setName(item.name);
        }
    }, [item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Nama kategori wajib diisi");

            return;
        }

        try {
            setLoading(true);

            await updateCategory(item.id, {
                name,
            });

            onSuccess();

            onClose();
        } catch (error) {
            console.log(error);

            alert("Gagal update kategori");
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
                    rounded-[28px]
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
                                <FolderPen
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
                                    Edit Kategori
                                </DialogTitle>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Perbarui nama kategori inventory.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="
                        px-5
                        sm:px-6
                        py-5
                        sm:py-6
                        space-y-5
                    "
                >
                    {/* INPUT */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Nama Kategori
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Elektronik"
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
                        {loading ? "Menyimpan..." : "Update Kategori"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
