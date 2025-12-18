import { api } from "@/app/api"
import {teacherManageSchema} from '../model/manage-schema'
import { z } from "zod"
import type { TTeacher } from "../model/teacher.types"


export const handleCreateTeacher = (data: z.infer<typeof teacherManageSchema>) => {
    return api.post("teachers", data)
}

export const getTeachers = () : Promise<{data: TTeacher[]}> => {
    return api.get("teachers")
}