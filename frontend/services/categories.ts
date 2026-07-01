import api from "@/lib/axios";

export async function getCategories() {
    const res = await api.get("/categories");

    return res.data;
}

export async function createCategory(data: any) {
    const res = await api.post("/categories", data);

    return res.data;
}

export async function updateCategory(id: number, data: any) {
    const res = await api.put(`/categories/${id}`, data);

    return res.data;
}

export async function deleteCategory(id: number) {
    const res = await api.delete(`/categories/${id}`);
    
    return res.data;
}
