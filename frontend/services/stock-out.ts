import api from "@/lib/axios";

export async function getStockOuts() {
    const res = await api.get("/stock-outs");

    return res.data;
}

export async function createStockOut(data: any) {
    const res = await api.post("/stock-outs", data);
    
    return res.data;
}

export const updateStockOut = async (id: number, data: any) => {
    const response = await api.put(`/stock-outs/${id}`, data);

    return response.data;
};

export const deleteStockOut = async (id: number) => {
    const response = await api.delete(`/stock-outs/${id}`);

    return response.data;
};
