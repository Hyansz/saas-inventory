import { ReactNode } from "react";

interface Props {
    title: string;
    value: number | string;
    icon?: ReactNode;
}

export default function SummaryCard({ title, value, icon }: Props) {
    return (
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-zinc-500">{title}</p>

                {icon}
            </div>

            <h2 className="text-3xl font-bold">{value}</h2>
        </div>
    );
}
