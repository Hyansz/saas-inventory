"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";

import { ChevronDown, UserPlus2 } from "lucide-react";

import { toast } from "sonner";

import { createUser } from "@/services/users";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddUserModal({ open, onClose, onSuccess }: Props) {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "manager",
    });

    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setForm({
            name: "",
            username: "",
            email: "",
            password: "",
            role: "manager",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !form.name.trim() ||
            !form.username.trim() ||
            !form.password.trim()
        ) {
            toast.error("Nama, username, dan password wajib diisi");

            return;
        }

        try {
            setLoading(true);

            await createUser({
                name: form.name,
                username: form.username,
                email: form.email.trim() || undefined,
                password: form.password,
                role: form.role,
            });

            toast.success("User berhasil ditambahkan");

            onSuccess();

            onClose();

            resetForm();
        } catch (err: any) {
            console.log(err);

            toast.error(
                err.response?.data?.message ?? "Gagal menambahkan user",
            );
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
                                <UserPlus2
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
                                    Tambah User
                                </DialogTitle>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Buat akun baru untuk sistem.
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
                        {/* NAMA */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Nama Lengkap
                            </label>

                            <input
                                type="text"
                                placeholder="Budi Santoso"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name: e.target.value,
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

                        {/* USERNAME */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Username
                            </label>

                            <input
                                type="text"
                                placeholder="budisantoso"
                                value={form.username}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        username: e.target.value
                                            .toLowerCase()
                                            .replace(/\s+/g, ""),
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* EMAIL */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Email{" "}
                                <span className="text-zinc-400 font-normal">
                                    (opsional)
                                </span>
                            </label>

                            <input
                                type="email"
                                placeholder="user@mail.com"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value,
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

                        {/* ROLE */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">
                                Role
                            </label>

                            <div className="relative mt-2">
                                <select
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            role: e.target.value,
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
                                        cursor-pointer
                                    "
                                >
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">
                                        Super Admin
                                    </option>
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

                    {/* PASSWORD */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Minimal 8 karakter"
                            value={form.password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password: e.target.value,
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
                            {loading ? "Menyimpan..." : "Simpan User"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
