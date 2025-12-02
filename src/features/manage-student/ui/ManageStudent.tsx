import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/kit/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/kit/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/shared/ui/kit/input";
import { Button } from "@/shared/ui/kit/button";

type TManageStudentProps = {
  open: boolean;
  onClose: () => void;
};

const nameRegex = /^([а-яё]+|[a-z]+)$/i;
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно содержать минимум 2 символа" })
    .regex(nameRegex, { message: "Имя должно содержать только буквы" }),
  surname: z
    .string()
    .min(2, { message: "Фамилия должна содержать минимум 2 символа" })
    .regex(nameRegex, { message: "Фамилия должна содержать только буквы" }),
    
  phone: z.string().min(1, { message: "Телефон должен быть заполнен" }),
  email: z.email({ message: "Email должен быть заполнен" }),
  age: z.number().min(1, { message: "Возраст должен быть заполнен" }),
});
const ManageStudent = ({ open, onClose }: TManageStudentProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      phone: "",
      email: "",
      age: 0,
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить студента</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            onReset={() => form.reset()}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите имя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите фамилию" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите телефон" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Возраст</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите возраст" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="reset" variant="outline">
                Сбросить
              </Button>
              <Button type="submit">Добавить</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageStudent;
