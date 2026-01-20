import { api } from "@/shared/api";
import type { TStudent } from "@/shared/student";

export const getStudent = (id: number): Promise<{ data: TStudent }> => {
    return api.get(`students/${id}`);
};