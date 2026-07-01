"use client";

import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            setLoading(true);

            await updateCategory(item.id, {
                name,
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.log(err);
            alert("Gagal update kategori");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Kategori</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <label className="text-sm font-medium text-zinc-700">
                        Nama Kategori Baru
                    </label>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border px-4 py-3 mt-2 rounded-lg"
                        placeholder="Nama kategori"
                    />

                    <button
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg"
                    >
                        {loading ? "Loading..." : "Update"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
