import z from "zod";

const nameRegex = /^([а-яё]+|[a-z]+)$/i;

export const studentManageSchema = z.object({
    firstName: z
      .string()
      .min(2, { message: "Имя должно содержать минимум 2 символа" })
      .regex(nameRegex, { message: "Имя должно содержать только буквы" }),
    lastName: z
      .string()
      .min(2, { message: "Фамилия должна содержать минимум 2 символа" })
      .regex(nameRegex, { message: "Фамилия должна содержать только буквы" }),
  
    phone: z.string().min(1, { message: "Телефон должен быть заполнен" }),
    email: z.email({ message: "Email должен быть заполнен" }),
    age: z.number().min(1, { message: "Возраст должен быть заполнен" }),
    teacherId: z.number(),
    gender: z.enum(["MALE", "FEMALE"], { message: "Пол должен быть заполнен" }),
  });