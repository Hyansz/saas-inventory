export function getActivityStyle(activity: any) {
    const type = activity.type || "";
    const message = (activity.message || "").toLowerCase();

    const isOut =
        type === "out" ||
        message.includes("keluar") ||
        message.includes("dikurangi");

    const isIn =
        type === "in" ||
        message.includes("masuk") ||
        message.includes("ditambahkan");

    if (isOut) {
        return {
            dot: "bg-rose-500",
            iconBg: "bg-rose-100 text-rose-600",
        };
    }

    if (isIn) {
        return {
            dot: "bg-emerald-500",
            iconBg: "bg-emerald-100 text-emerald-600",
        };
    }

    return {
        dot: "bg-blue-500",
        iconBg: "bg-blue-100 text-blue-600",
    };
}
