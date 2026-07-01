"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

interface Props {
    title: string;
    data: any[];
    dataKey: string;
}

export default function StockChart({ data, dataKey }: Props) {
    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e4e4e7"
                    />

                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                    />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke="#18181b"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                            r: 6,
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
