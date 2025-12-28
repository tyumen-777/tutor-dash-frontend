import type { TStudent } from "../student";

export type TTeacher = {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    students: Array<TStudent>
}