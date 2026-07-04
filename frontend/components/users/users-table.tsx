"use client";

import { type ManagedUser } from "@/services/users";
import TableAction from "@/components/ui/table-action";

const roleLabel: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    manager: "Manager",
};

const roleBadge: Record<string, string> = {
    super_admin: "bg-purple-500/15 text-purple-500 border-purple-500/80",
    admin: "bg-blue-500/15 text-blue-500 border-blue-500/80",
    manager: "bg-zinc-500/15 text-zinc-500 border-zinc-500/80",
};

function RoleBadge({ role }: { role: string }) {
    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-medium
                ${roleBadge[role] ?? "bg-zinc-100 text-zinc-600 border-zinc-200"}
            `}
        >
            {roleLabel[role] ?? role}
        </span>
    );
}

function Avatar({ name }: { name: string }) {
    return (
        <div
            className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-black
                text-xs
                font-semibold
                uppercase
                text-white
                flex-shrink-0
            "
        >
            {name.charAt(0)}
        </div>
    );
}

interface UsersTableProps {
    data: ManagedUser[];
    onEdit: (user: ManagedUser) => void;
    onDelete: (user: ManagedUser) => void;
}

export default function UsersTable({
    data,
    onEdit,
    onDelete,
}: UsersTableProps) {
    if (data.length === 0) {
        return (
            <div
                className="
                    rounded-[28px]
                    border
                    border-zinc-200
                    bg-white
                    px-6
                    py-10
                    text-center
                    text-sm
                    text-zinc-500
                "
            >
                Tidak ada user ditemukan.
            </div>
        );
    }

    return (
        <>
            {/* MOBILE: CARD VIEW */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
                {data.map((user) => (
                    <div
                        key={user.id}
                        className="
                            rounded-[24px]
                            border
                            border-zinc-200
                            bg-white
                            p-4
                        "
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <Avatar name={user.name} />

                                <div className="min-w-0">
                                    <p className="font-medium truncate">
                                        {user.name}
                                    </p>

                                    <p className="text-xs text-zinc-500 truncate">
                                        {user.username}
                                    </p>
                                </div>
                            </div>

                            <TableAction
                                onEdit={() => onEdit(user)}
                                onDelete={() => onDelete(user)}
                            />
                        </div>

                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                justify-between
                                border-t
                                border-zinc-100
                                pt-3
                                text-xs
                                text-zinc-500
                            "
                        >
                            <RoleBadge role={user.role} />
                            <span className="truncate max-w-[60%] text-right">
                                {user.email || "-"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* DESKTOP: TABLE VIEW */}
            <div
                className="
                    hidden
                    md:block
                    rounded-[28px]
                    border
                    border-zinc-200
                    bg-white
                    overflow-hidden
                "
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr
                                className="
                                    border-b
                                    border-zinc-100
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-zinc-400
                                "
                            >
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100">
                            {data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-zinc-50/50 transition"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={user.name} />

                                            <span className="font-medium">
                                                {user.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-zinc-600">
                                        {user.username}
                                    </td>

                                    <td className="px-6 py-4 text-zinc-600">
                                        {user.email || "-"}
                                    </td>

                                    <td className="px-6 py-4">
                                        <RoleBadge role={user.role} />
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <TableAction
                                                onEdit={() => onEdit(user)}
                                                onDelete={() => onDelete(user)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
