"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
    FolderTree,
    Plus,
    Pencil,
    Trash2,
    Shapes,
    ChevronRight,
    X,
    Sparkles,
    TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getCategories, deleteCategory } from "@/services/categories";

import AddCategoryModal from "@/components/categories/add-category-modal";
import EditCategoryModal from "@/components/categories/edit-category-modal";
import CategoriesTable from "@/components/categories/categories-table";

import TableEmpty from "@/components/ui/table-empty";

const ITEMS_PER_PAGE = 10;

export default function CategoriesPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [warningOpen, setWarningOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : {};

    const isAdmin = user.role === "admin";

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (user.role !== "admin" && user.role !== "super_admin") {
            router.push("/dashboard");
        }
    }, [router]);

    const { data = [], isLoading } = useQuery({
        queryKey: ["categories"],

        queryFn: getCategories,

        staleTime: 1000 * 60 * 5,

        gcTime: 1000 * 60 * 10,

        refetchOnWindowFocus: false,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            setDeleteOpen(false);

            setSelectedDelete(null);
        },
    });

    const filteredData = useMemo(() => {
        return data.filter((item: any) =>
            item.name?.toLowerCase().includes(search.toLowerCase()),
        );
    }, [data, search]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;

        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, page]);

    const handleDelete = (item: any) => {
        if (item.items_count > 0) {
            setWarningMessage(
                `Kategori "${item.name}" sedang digunakan oleh ${item.items_count} produk. Hapus atau pindahkan produk tersebut terlebih dahulu sebelum menghapus kategori ini.`,
            );

            setWarningOpen(true);

            return;
        }

        setSelectedDelete(item);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedDelete) return;

        deleteMutation.mutate(selectedDelete.id);
    };

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-72 rounded-[2.5rem] bg-zinc-200" />

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="h-40 rounded-[2rem] bg-zinc-200" />
                    <div className="h-40 rounded-[2rem] bg-zinc-200" />
                </div>

                <div className="h-[500px] rounded-[2rem] bg-zinc-200" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
                {/* Glow Background */}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

                <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

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
                            <Sparkles size={14} />
                            Smart Category Management
                        </div>

                        {isAdmin && (
                            <div className="flex items-center gap-3 flex-wrap">
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
                                    <Plus size={18} />
                                    Tambah Kategori
                                </button>
                            </div>
                        )}
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
                                Kategori Inventory
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
                                Bangun struktur kategori yang rapi untuk seluruh
                                inventory. Kelompokkan produk dengan lebih
                                terorganisir agar proses pencarian, monitoring,
                                serta analisis stok menjadi lebih cepat dan
                                efisien.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* KPI */}

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                    title="Total Kategori"
                    value={data.length}
                    icon={<Shapes size={18} />}
                />

                <MetricCard
                    title="Kategori Aktif"
                    value={data.length}
                    icon={<FolderTree size={18} />}
                    positive
                />
            </section>

            {/* MOBILE */}

            <div className="lg:hidden space-y-4">
                {data.length === 0 ? (
                    <div
                        className="
                            rounded-[2rem]
                            border
                            border-zinc-200/80
                            bg-white
                            px-6
                            py-16
                            shadow-sm
                        "
                    >
                        <TableEmpty
                            title="Belum ada kategori"
                            description="Kategori inventory akan muncul di sini."
                        />
                    </div>
                ) : (
                    data.map((item: any) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={item.id}
                            className="
                                group
                                rounded-[2rem]
                                border
                                border-zinc-200/80
                                bg-white
                                p-5
                                shadow-sm
                                transition-all
                                hover:shadow-md
                            "
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex items-center gap-4">
                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            border-zinc-200
                                            bg-zinc-50
                                        "
                                    >
                                        <FolderTree
                                            size={18}
                                            className="text-zinc-700"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate font-semibold tracking-tight">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-zinc-500">
                                            Kategori Inventory
                                        </p>
                                    </div>
                                </div>

                                <ChevronRight
                                    size={18}
                                    className="
                                        text-zinc-300
                                        transition
                                        group-hover:translate-x-1
                                    "
                                />
                            </div>

                            <div className="mt-5 flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelected(item);
                                        setEditOpen(true);
                                    }}
                                    className="
                                        flex-1
                                        h-11
                                        rounded-2xl
                                        border
                                        border-zinc-200
                                        bg-white
                                        text-sm
                                        font-medium
                                        transition
                                        hover:bg-zinc-50
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >
                                    <Pencil size={16} />
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(item)}
                                    className={`
                                        flex-1
                                        h-11
                                        rounded-2xl
                                        text-sm
                                        font-semibold
                                        transition
                                        flex
                                        items-center
                                        justify-center
                                        gap-2

                                        ${
                                            item.items_count > 0
                                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                : "bg-red-50 text-red-600 hover:bg-red-100"
                                        }
                                    `}
                                >
                                    <Trash2 size={16} />
                                    Hapus
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* DESKTOP TABLE */}

            <div className="hidden lg:block">
                <CategoriesTable
                    items={paginatedData}
                    search={search}
                    onEdit={(item) => {
                        setSelected(item);
                        setEditOpen(true);
                    }}
                    onDelete={handleDelete}
                />
            </div>

            {/* MODALS */}

            <AddCategoryModal
                open={open}
                onClose={() => setOpen(false)}
                onSuccess={() => {
                    queryClient.invalidateQueries({
                        queryKey: ["categories"],
                    });
                }}
            />

            <EditCategoryModal
                open={editOpen}
                item={selected}
                onClose={() => setEditOpen(false)}
                onSuccess={() => {
                    queryClient.invalidateQueries({
                        queryKey: ["categories"],
                    });
                }}
            />

            {/* DELETE MODAL */}

            {deleteOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        bg-black/50
                        backdrop-blur-md
                        flex
                        items-center
                        justify-center
                        p-4
                    "
                >
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="
                            relative
                            w-full
                            max-w-md
                            overflow-hidden
                            rounded-[2rem]
                            border
                            border-zinc-200
                            bg-white
                            p-6
                            shadow-2xl
                        "
                    >
                        <button
                            onClick={() => setDeleteOpen(false)}
                            className="
                                absolute
                                right-4
                                top-4
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                transition
                                hover:bg-zinc-100
                            "
                        >
                            <X size={18} />
                        </button>

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-red-100
                                text-red-600
                            "
                        >
                            <Trash2 size={24} />
                        </div>

                        <h2 className="mt-6 text-2xl font-semibold tracking-tight">
                            Hapus Kategori
                        </h2>

                        <p className="mt-3 leading-7 text-zinc-500">
                            Yakin ingin menghapus kategori
                            <span className="font-semibold text-zinc-900">
                                {" "}
                                "{selectedDelete?.name}"
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </p>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setDeleteOpen(false)}
                                className="
                                    flex-1
                                    h-12
                                    rounded-2xl
                                    border
                                    border-zinc-200
                                    bg-white
                                    font-medium
                                    transition
                                    hover:bg-zinc-50
                                "
                            >
                                Batal
                            </button>

                            <button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="
                                    flex-1
                                    h-12
                                    rounded-2xl
                                    bg-red-600
                                    text-white
                                    font-semibold
                                    transition
                                    hover:bg-red-700
                                    disabled:opacity-50
                                "
                            >
                                {deleteMutation.isPending
                                    ? "Menghapus..."
                                    : "Hapus"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {warningOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        bg-black/50
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        p-4
                    "
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="
                            w-full
                            max-w-md
                            rounded-[2rem]
                            bg-white
                            p-6
                            border
                            border-zinc-200
                            shadow-2xl
                        "
                    >
                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-amber-100
                                text-amber-600
                            "
                        >
                            <FolderTree size={24} />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold">
                            Kategori Sedang Digunakan
                        </h2>

                        <p className="mt-3 text-zinc-500 leading-7">
                            {warningMessage}
                        </p>

                        <button
                            onClick={() => setWarningOpen(false)}
                            className="
                                mt-6
                                w-full
                                h-12
                                rounded-2xl
                                bg-black
                                text-white
                                font-medium
                                hover:opacity-90
                            "
                        >
                            Mengerti
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

/* MINI CARD */

function MiniCard({ icon, label, value }: any) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                p-4
            "
        >
            <div className="flex items-center gap-3">
                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-2xl
                        bg-white/10
                    "
                >
                    {icon}
                </div>

                <div>
                    <p className="text-xs text-zinc-400">{label}</p>

                    <h3 className="text-lg font-semibold">{value}</h3>
                </div>
            </div>
        </div>
    );
}

/* KPI */

function MetricCard({ title, value, icon, positive }: any) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="
                group
                relative
                overflow-hidden
                rounded-[2rem]
                border
                border-zinc-200
                bg-white
                p-5
                shadow-sm
                transition-all
                hover:shadow-xl
            "
        >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="relative z-10">
                <div
                    className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        ${
                            positive
                                ? "bg-green-100 text-green-600"
                                : "bg-zinc-100 text-zinc-700"
                        }
                    `}
                >
                    {icon}
                </div>

                <div className="mt-5">
                    <p className="text-sm text-zinc-500">{title}</p>

                    <div className="mt-2 flex items-end justify-between">
                        <h3 className="text-3xl font-semibold tracking-tight">
                            {value}
                        </h3>

                        <TrendingUp size={16} className="text-zinc-300" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
