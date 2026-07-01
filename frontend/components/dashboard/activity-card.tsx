interface Props {
    title: string;
    items: any[];
    type: "in" | "out";
}

export default function ActivityCard({ title, items, type }: Props) {
    return (
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="font-semibold text-lg">{title}</h2>
            </div>

            <div className="space-y-4">
                {items.length === 0 && (
                    <p className="text-sm text-zinc-500">Belum ada data.</p>
                )}

                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <p className="font-medium">
                                {item.item?.nama_barang}
                            </p>

                            <p className="text-sm text-zinc-500">
                                {type === "in" ? item.supplier : item.tujuan}
                            </p>
                        </div>

                        <div
                            className={`
                                text-sm font-semibold
                                ${
                                    type === "in"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            `}
                        >
                            {type === "in" ? "+" : "-"}

                            {item.qty}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
