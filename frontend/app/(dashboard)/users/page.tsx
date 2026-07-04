"use client";

import { motion } from "framer-motion";
import { UsersRound, UserPlus, ShieldCheck, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getUsers, deleteUser, type ManagedUser } from "@/services/users";

import AddUserModal from "@/components/users/add-user-modal";
import EditUserModal from "@/components/users/edit-user-modal";
import UsersTable from "@/components/users/users-table";
import TablePagination from "@/components/ui/table-paginaton";

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ManagedUser | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const queryClient = useQueryClient();

    const { data = [], isLoading } = useQuery({
        queryKey: ["users"],

        queryFn: async () => {
            return await getUsers();
        },

        staleTime: 1000 * 60 * 5,
    });

    const filteredData = useMemo(() => {
        return data.filter((item: ManagedUser) => {
            const keyword = search.toLowerCase();

            return (
                item.name?.toLowerCase().includes(keyword) ||
                item.username?.toLowerCase().includes(keyword) ||
                item.email?.toLowerCase().includes(keyword)
            );
        });
    }, [data, search]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;

        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, page]);

    const totalSuperAdmin = data.filter(
        (u: ManagedUser) => u.role === "super_admin",
    ).length;

    const totalAdmin = data.filter(
        (u: ManagedUser) => u.role === "admin",
    ).length;

    const totalManager = data.filter(
        (u: ManagedUser) => u.role === "manager",
    ).length;

    const handleDelete = async (item: ManagedUser) => {
        if (!confirm(`Hapus user "${item.name}"?`)) return;

        try {
            await deleteUser(item.id);

            toast.success("User berhasil dihapus");

            queryClient.invalidateQueries({ queryKey: ["users"] });
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ?? "Gagal menghapus user",
            );
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-72 rounded-[32px] bg-zinc-100" />

                <div className="h-[500px] rounded-[32px] bg-zinc-100" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* HERO */}
            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="
                    relative
                    overflow-hidden
                    rounded-[2.5rem]
                    border
                    border-white/10
                    bg-gradient-to-br
                    from-zinc-950
                    via-zinc-900
                    to-black
                    p-6
                    md:p-8
                    text-white
                    shadow-2xl
                "
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

                <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

                <div className="relative z-10">
                    {/* TOP */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-white/10
                                bg-white/10
                                px-4
                                py-2
                                text-xs
                                font-medium
                                backdrop-blur-xl
                            "
                        >
                            <UsersRound size={14} />
                            Access Control
                        </div>

                        <button
                            onClick={() => setOpen(true)}
                            className="
                                inline-flex
                                h-12
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                bg-white
                                px-5
                                text-sm
                                font-semibold
                                text-black
                                transition-all
                                hover:scale-[1.02]
                                active:scale-[0.99]
                                cursor-pointer
                            "
                        >
                            <UserPlus size={18} />
                            Tambah User
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="mt-10 flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-3xl">
                            <h1
                                className="
                                    text-4xl
                                    md:text-6xl
                                    font-semibold
                                    tracking-tight
                                    leading-none
                                "
                            >
                                User Management
                            </h1>

                            <p
                                className="
                                    mt-5
                                    max-w-2xl
                                    text-sm
                                    md:text-base
                                    leading-relaxed
                                    text-zinc-300
                                "
                            >
                                Kelola akun, role, dan hak akses seluruh
                                pengguna sistem inventory secara terpusat dan
                                aman.
                            </p>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="mt-10 grid grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard
                            title="Total User"
                            value={data.length}
                            icon={<UsersRound size={18} />}
                        />

                        <StatCard
                            title="Super Admin"
                            value={totalSuperAdmin}
                            icon={<ShieldCheck size={18} />}
                            positive
                        />

                        <StatCard
                            title="Admin"
                            value={totalAdmin}
                            icon={<ShieldCheck size={18} />}
                        />

                        <StatCard
                            title="Manager"
                            value={totalManager}
                            icon={<UsersRound size={18} />}
                        />
                    </div>
                </div>
            </motion.section>

            {/* SEARCH */}
            <div
                className="
                    rounded-[28px]
                    border
                    border-zinc-200
                    bg-white
                    p-4
                "
            >
                <div className="relative">
                    <Search
                        size={18}
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-zinc-400
                        "
                    />

                    <input
                        placeholder="Cari nama, username, atau email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="
                            w-full
                            h-12
                            rounded-2xl
                            border
                            border-zinc-200
                            bg-zinc-50
                            pl-11
                            pr-4
                            text-sm
                            focus:outline-none
                            focus:ring-4
                            focus:ring-zinc-200
                        "
                    />
                </div>
            </div>

            {/* TABLE / CARDS */}
            <UsersTable
                data={paginatedData}
                onEdit={(user) => {
                    setSelectedItem(user);
                    setEditOpen(true);
                }}
                onDelete={handleDelete}
            />

            {/* PAGINATION */}
            <TablePagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />

            {/* MODAL */}
            <AddUserModal
                open={open}
                onClose={() => setOpen(false)}
                onSuccess={() =>
                    queryClient.invalidateQueries({ queryKey: ["users"] })
                }
            />

            <EditUserModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                item={selectedItem}
                onSuccess={() =>
                    queryClient.invalidateQueries({ queryKey: ["users"] })
                }
            />
        </div>
    );
}

function StatCard({ title, value, icon, positive }: any) {
    return (
        <div
            className="
                rounded-3xl
                border
                border-white/10
                bg-white/[0.03]
                p-5
            "
        >
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">{title}</p>

                <div className="text-zinc-500">{icon}</div>
            </div>

            <h3 className="mt-4 text-3xl font-bold">{value}</h3>
        </div>
    );
}
