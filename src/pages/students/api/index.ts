import { api } from "@/app/api";
import type { TStudent } from "../model/student.types";

export const getStudents = (): Promise<{ data: TStudent[] }> => {
    return api.get("students");
  };