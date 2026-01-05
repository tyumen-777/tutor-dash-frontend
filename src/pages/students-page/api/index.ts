import { api } from "@/shared/api";
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

export const handleDeleteStudent = (id: number): Promise<{ data: TStudent }> => {
  return api.delete(`students/${id}`);
};

export const getStudent = (id: number): Promise<{ data: TStudent }> => {
  return api.get(`students/${id}`);
};

export const handleUpdateStudent = ({ id, data }: { id: number; data: z.infer<typeof studentManageSchema> }): Promise<{data: TStudent}> => {
  return api.patch(`students/${id}`, data);
};