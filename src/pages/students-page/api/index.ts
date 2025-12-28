import { api } from "@/app/api";
import type { TStudent } from "@/shared/student";
import type { TTeacher } from "@/shared/teacher";
import { z } from "zod";
import { studentManageSchema } from "../model/manage-schema";

export const getStudents = (): Promise<{ data: TStudent[] }> => {
  return api.get("students");
};

export const getTeachers = (): Promise<{ data: TTeacher[] }> => {
  return api.get("teachers");
};

export const handleCreateStudent = (data: z.infer<typeof studentManageSchema>): Promise<{ data: TStudent }> => {
  return api.post("students", data);
};