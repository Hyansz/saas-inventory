"use client";

interface Props {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    iconColor?: keyof typeof colors;
}

const colors = {
    neutral: "bg-zinc-100 text-zinc-600",

    stock_in: "bg-emerald-100 text-emerald-600",
    stock_out: "bg-rose-100 text-rose-600",

    activity: "bg-blue-100 text-blue-600",

    chart_in: "bg-emerald-50 text-emerald-500",
    chart_out: "bg-rose-50 text-rose-500",

    warning: "bg-amber-100 text-amber-600",

    insight: "bg-violet-100 text-violet-600",
};

export default function DashboardCard({
    title,
    subtitle,
    children,
    icon,
    iconColor = "neutral",
}: Props) {
    return (
        <div
            className="
                rounded-[2rem]
                border
                border-zinc-200
                bg-white
                p-5
                shadow-sm
                transition-all
                hover:shadow-md
            "
        >
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
                    )}
                </div>

                {icon && (
                    <div
                        className={`
                            w-10 h-10
                            rounded-2xl
                            flex items-center justify-center
                            ${colors[iconColor]}
                        `}
                    >
                        {icon}
                    </div>
                )}
            </div>

            {children}
        </div>
    );
}
