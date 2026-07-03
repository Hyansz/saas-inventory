"use client";

import { useEffect, useState } from "react";

import { UserPlus, Pencil, Trash2, ShieldCheck } from "lucide-react";

import { toast } from "sonner";

import { getUsers, deleteUser, type ManagedUser } from "@/services/users";

import AddUserModal from "@/components/users/add-user-modal";
import EditUserModal from "@/components/users/edit-user-modal";

const roleLabel: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    manager: "Manager",
};

const roleColor: Record<string, string> = {
    super_admin: "bg-purple-100 text-purple-700",
    admin: "bg-blue-100 text-blue-700",
    manager: "bg-zinc-100 text-zinc-700",
};

export default function UsersPage() {
    const [users, setUsers] = useState<ManagedUser[]>([]);

    const [loading, setLoading] = useState(true);

    const [addOpen, setAddOpen] = useState(false);

    const [editItem, setEditItem] = useState<ManagedUser | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);

            const data = await getUsers();

            setUsers(data);
        } catch (error) {
            console.log(error);

            toast.error("Gagal memuat data user");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (user: ManagedUser) => {
        const confirmed = confirm(
            `Hapus user "${user.name}"? Aksi ini tidak bisa dibatalkan.`,
        );

        if (!confirmed) return;

        try {
            await deleteUser(user.id);

            toast.success("User berhasil dihapus");

            loadUsers();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ?? "Gagal menghapus user",
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        User Management
                    </h1>

                    <p className="text-sm text-zinc-500 mt-1">
                        Kelola akun, role, dan akses pengguna sistem.
                    </p>
                </div>

                <button
                    onClick={() => setAddOpen(true)}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        bg-black
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:opacity-90
                        cursor-pointer
                    "
                >
                    <UserPlus size={16} />
                    Tambah User
                </button>
            </div>

            <div
                className="
                    rounded-3xl
                    border
                    border-zinc-200
                    bg-white
                    overflow-hidden
                "
            >
                {loading ? (
                    <div className="p-10 text-center text-sm text-zinc-500">
                        Memuat data...
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-10 text-center text-sm text-zinc-500">
                        Belum ada user.
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                    px-6
                                    py-4
                                "
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-black
                                            text-sm
                                            font-semibold
                                            uppercase
                                            text-white
                                            flex-shrink-0
                                        "
                                    >
                                        {user.name.charAt(0)}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium truncate">
                                                {user.name}
                                            </p>

                                            {user.role === "super_admin" && (
                                                <ShieldCheck
                                                    size={14}
                                                    className="text-purple-600 flex-shrink-0"
                                                />
                                            )}
                                        </div>

                                        <p className="text-sm text-zinc-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>

                                    <span
                                        className={`
                                            text-xs
                                            font-medium
                                            px-3
                                            py-1
                                            rounded-full
                                            flex-shrink-0
                                            ${roleColor[user.role]}
                                        `}
                                    >
                                        {roleLabel[user.role]}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setEditItem(user)}
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-zinc-200
                                            transition
                                            hover:bg-zinc-50
                                            cursor-pointer
                                        "
                                    >
                                        <Pencil size={15} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(user)}
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-red-200
                                            text-red-600
                                            transition
                                            hover:bg-red-50
                                            cursor-pointer
                                        "
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AddUserModal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onSuccess={loadUsers}
            />

            <EditUserModal
                open={!!editItem}
                onClose={() => setEditItem(null)}
                onSuccess={loadUsers}
                item={editItem}
            />
        </div>
    );
}
