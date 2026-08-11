import api from "@/lib/axios";

export const getStockOpnames = async (page = 1) => {
    const response = await api.get("/stock-opnames", { params: { page } });

    return response.data;
};

export const getStockOpname = async (id: number) => {
    const response = await api.get(`/stock-opnames/${id}`);

    return response.data;
};

export const createStockOpname = async (data: any) => {
    const response = await api.post("/stock-opnames", data);

    return response.data;
};

export const completeStockOpname = async (id: number, data: any) => {
    const response = await api.post(`/stock-opnames/${id}/complete`, data);

    return response.data;
};

export const deleteStockOpname = async (id: number) => {
    const response = await api.delete(`/stock-opnames/${id}`);

    return response.data;
};
