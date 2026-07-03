"use client";

import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { UserCog } from "lucide-react";

import { toast } from "sonner";

import { updateUser, type ManagedUser } from "@/services/users";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: ManagedUser | null;
}

export default function EditUserModal({
    open,
    onClose,
    onSuccess,
    item,
}: Props) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("manager");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setName(item.name);
            setUsername((item as any).username ?? "");
            setEmail(item.email ?? "");
            setRole(item.role);
            setPassword("");
        }
    }, [item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!item) return;

        if (!name.trim() || !username.trim()) {
            toast.error("Nama dan username wajib diisi");

            return;
        }

        try {
            setLoading(true);

            await updateUser(item.id, {
                name,
                username,
                email: email.trim() || undefined,
                role,
                ...(password.trim() ? { password } : {}),
            });

            toast.success("User berhasil diupdate");

            onSuccess();

            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message ?? "Gagal update user");
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
                                <UserCog size={20} className="text-zinc-700" />
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
                                    Edit User
                                </DialogTitle>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Perbarui data akun pengguna.
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
                        space-y-4
                        max-h-[70vh]
                        overflow-y-auto
                    "
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Nama Lengkap
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                        .toLowerCase()
                                        .replace(/\s+/g, ""),
                                )
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Email{" "}
                            <span className="text-zinc-400 font-normal">
                                (opsional)
                            </span>
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Password Baru{" "}
                            <span className="text-zinc-400 font-normal">
                                (kosongkan jika tidak diubah)
                            </span>
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Role
                        </label>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
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
                        >
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                    </div>

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
                        {loading ? "Menyimpan..." : "Update User"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
