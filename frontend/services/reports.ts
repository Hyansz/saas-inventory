import api from "@/lib/axios";

export async function downloadExcel(params: any) {
    const response = await api.get("/reports/excel", {
        params,
        responseType: "blob",
    });

    return response.data;
}

export async function downloadPdf(params: any) {
    const response = await api.get("/reports/pdf", {
        params,
        responseType: "blob",
    });

    return response.data;
}
