"use client";

import {
    CheckCircle2,
    AlertTriangle,
    Info,
    Circle,
} from "lucide-react";

interface Props {
    children: React.ReactNode;

    variant?: "success" | "danger" | "warning" | "info" | "neutral";
}

export default function StatusBadge({ children, variant = "neutral" }: Props) {
    const styles = {
        success: {
            wrapper: "bg-emerald-100 text-emerald-700",
            icon: <CheckCircle2 size={14} />,
        },

        danger: {
            wrapper: "bg-red-100 text-red-700",
            icon: <AlertTriangle size={14} />,
        },

        warning: {
            wrapper: "bg-amber-100 text-amber-700",
            icon: <AlertTriangle size={14} />,
        },

        info: {
            wrapper: "bg-blue-100 text-blue-700",
            icon: <Info size={14} />,
        },

        neutral: {
            wrapper: "bg-zinc-100 text-zinc-700",
            icon: <Circle size={12} />,
        },
    };

    return (
        <div
            className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                px-3
                py-1.5
                text-xs
                font-semibold
                ${styles[variant].wrapper}
            `}
        >
            {styles[variant].icon}

            {children}
        </div>
    );
}
