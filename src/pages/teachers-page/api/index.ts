import { api } from "@/shared/api"
import {teacherManageSchema} from '../model/manage-schema'
import { z } from "zod"
import type { TTeacher } from "@/shared/teacher"


export const handleCreateTeacher = (data: z.infer<typeof teacherManageSchema>) => {
    return api.post("teachers", data)
}

export const getTeachers = () : Promise<{data: TTeacher[]}> => {
    return api.get("teachers")
}