import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/services/items";

interface Params {
    search?: string;
    page?: number;
}

export function useItems({ search, page }: Params) {
    return useQuery({
        queryKey: ["items", search, page],

        queryFn: () =>
            getItems({
                search,
                page,
            }),

        placeholderData: (previousData) => previousData,
    });
}
