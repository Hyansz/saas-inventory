import api from "@/lib/axios";

export const getStockIns = async () => {
    const response = await api.get("/stock-ins");

    return response.data;
};

export const createStockIn = async (data: any) => {
    const response = await api.post("/stock-ins", data);

    return response.data;
};

export const updateStockIn = async (id: number, data: any) => {
    const response = await api.put(`/stock-ins/${id}`, data);

    return response.data;
};

export const deleteStockIn = async (id: number) => {
    const response = await api.delete(`/stock-ins/${id}`);

    return response.data;
};
