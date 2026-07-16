"use client";

import { LogOut, Monitor, Smartphone, Tablet } from "lucide-react";

import { type ActiveSession } from "@/services/sessions";

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

function formatLoginDate(value: string | null) {
    if (!value) return "-";

    return new Date(value).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

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
                relative
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

            <span
                className="
                    absolute
                    -bottom-0.5
                    -right-0.5
                    h-3
                    w-3
                    rounded-full
                    bg-emerald-500
                    border-2
                    border-white
                "
            />
        </div>
    );
}

function DeviceIcon({ device }: { device: string }) {
    if (device === "Mobile") return <Smartphone size={14} />;
    if (device === "Tablet") return <Tablet size={14} />;
    return <Monitor size={14} />;
}

function ForceLogoutButton({
    session,
    processingId,
    onForceLogout,
    fullWidth,
}: {
    session: ActiveSession;
    processingId: number | null;
    onForceLogout: (session: ActiveSession) => void;
    fullWidth?: boolean;
}) {
    const isProcessing = processingId === session.token_id;

    return (
        <button
            onClick={() => onForceLogout(session)}
            disabled={isProcessing}
            className={`
                flex
                items-center
                ${fullWidth ? "justify-center" : "justify-end"}
                gap-2
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-3
                py-2
                text-xs
                font-medium
                text-red-600
                transition
                hover:bg-red-100
                disabled:opacity-50
                cursor-pointer
                ${fullWidth ? "w-full" : ""}
            `}
        >
            <LogOut size={13} />
            {isProcessing ? "Memproses..." : "Logout Paksa"}
        </button>
    );
}

interface SessionsTableProps {
    data: ActiveSession[];
    processingId: number | null;
    onForceLogout: (session: ActiveSession) => void;
}

export default function SessionsTable({
    data,
    processingId,
    onForceLogout,
}: SessionsTableProps) {
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
                Tidak ada sesi aktif saat ini.
            </div>
        );
    }

    return (
        <>
            {/* MOBILE: CARD VIEW */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
                {data.map((session) => (
                    <div
                        key={session.token_id}
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
                                <Avatar name={session.name} />

                                <div className="min-w-0">
                                    <p className="font-medium truncate">
                                        {session.name}
                                    </p>

                                    <p className="text-xs text-zinc-500 truncate">
                                        {session.username}
                                    </p>
                                </div>
                            </div>

                            <RoleBadge role={session.role} />
                        </div>

                        {/* DEVICE INFO */}
                        <div
                            className="
                                mt-3
                                flex
                                items-center
                                gap-4
                                text-xs
                                text-zinc-500
                            "
                        >
                            <span className="inline-flex items-center gap-1">
                                <DeviceIcon device={session.device} />
                                {session.browser} &middot; {session.os}
                            </span>

                            <span className="text-zinc-300">|</span>

                            <span>{session.ip_address}</span>
                        </div>

                        <div
                            className="
                                mt-3
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
                            <span>Login Sejak</span>
                            <span>{formatLoginDate(session.logged_in_at)}</span>
                        </div>

                        <div className="mt-3">
                            <ForceLogoutButton
                                session={session}
                                processingId={processingId}
                                onForceLogout={onForceLogout}
                                fullWidth
                            />
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
                                <th className="px-6 py-4">Perangkat</th>
                                <th className="px-6 py-4">IP Address</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Login Sejak</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100">
                            {data.map((session) => (
                                <tr
                                    key={session.token_id}
                                    className="hover:bg-zinc-50/50 transition"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={session.name} />

                                            <div>
                                                <span className="font-medium block">
                                                    {session.name}
                                                </span>
                                                <span className="text-xs text-zinc-400">
                                                    {session.username}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-zinc-600">
                                            <DeviceIcon
                                                device={session.device}
                                            />
                                            <span>
                                                {session.browser} &middot;{" "}
                                                {session.os}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                                        {session.ip_address}
                                    </td>

                                    <td className="px-6 py-4">
                                        <RoleBadge role={session.role} />
                                    </td>

                                    <td className="px-6 py-4 text-zinc-500">
                                        {formatLoginDate(
                                            session.logged_in_at,
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <ForceLogoutButton
                                                session={session}
                                                processingId={processingId}
                                                onForceLogout={onForceLogout}
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
