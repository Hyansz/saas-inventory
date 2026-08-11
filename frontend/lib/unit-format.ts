export function formatUnitQty(record: any): string {
    const qtyUnit = record.qty_unit ?? record.qty;
    const unitName =
        record.unit?.nama_unit ??
        record.item?.satuan_dasar?.nama_unit ??
        "pcs";

    return `${Number(qtyUnit)} ${unitName}`;
}

export function formatUnitName(item: any): string {
    return (
        item?.satuan_dasar?.nama_unit ??
        item?.units?.find((u: any) => u.is_base)?.nama_unit ??
        "pcs"
    );
}

export function convertPreview(
    qtyUnit: number,
    unit: any,
    baseName: string,
): string {
    if (!unit || !qtyUnit || unit.is_base) return "";

    const qtyBase = qtyUnit * unit.konversi;
    const pretty = Number.isInteger(qtyBase)
        ? qtyBase
        : qtyBase.toFixed(2);

    return `${qtyUnit} ${unit.nama_unit} = ${pretty} ${baseName}`;
}
