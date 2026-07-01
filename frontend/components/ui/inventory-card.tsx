"use client";

interface InventoryCardProps {
    title: string;
    subtitle?: string;

    badge?: React.ReactNode;

    details?: {
        label: string;
        value: string | number;
    }[];

    footer?: React.ReactNode;

    action?: React.ReactNode;
}

export default function InventoryCard({
    title,
    subtitle,
    badge,
    details,
    footer,
    action,
}: InventoryCardProps) {
    return (
        <div
            className="
                rounded-[2rem]
                border
                border-zinc-200
                bg-white
                p-5
                shadow-sm
            "
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="font-semibold truncate">{title}</h3>

                    {subtitle && (
                        <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
                    )}
                </div>

                {action}
            </div>

            {badge && <div className="mt-4">{badge}</div>}

            {details && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {details.map((detail) => (
                        <div key={detail.label}>
                            <p className="text-xs text-zinc-400">
                                {detail.label}
                            </p>

                            <p className="mt-1 text-sm font-medium">
                                {detail.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {footer && <div className="mt-4">{footer}</div>}
        </div>
    );
}
