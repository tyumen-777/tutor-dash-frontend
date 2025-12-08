import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/kit/dialog.tsx";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/ui/kit/input.tsx";
import { Button } from "@/shared/ui/kit/button.tsx";

type TCreateStudent = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export const CreateStudent = ({ isOpen, onClose }: TCreateStudent) => {
  const { register, handleSubmit } = useForm();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data);
          })}
        >
          <DialogHeader>
            <DialogTitle>Создание ученика</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 my-4">
            <Input {...register("name")} placeholder="Имя" />
            <Input {...register("surname")} placeholder="Фамилия" />
            <Input {...register("phone")} placeholder="Телефон" />
            <Input {...register("age")} placeholder="Возраст" />
            <Input {...register("email")} placeholder="Email" />
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" type="button">
                Отменить
              </Button>
            </DialogClose>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
