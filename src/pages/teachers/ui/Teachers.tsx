import { Button } from "@/shared/ui/kit/button";
import { Input } from "@/shared/ui/kit/input";
import { Table, TableHeader } from "@/shared/ui/kit/table";
import { CirclePlus } from "lucide-react";
import { ManageTeacher } from "./ManageTeacher";
import { useState } from "react";

const Teachers = () => {
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  return (
    <>
    <div className="w-full">
      <div>Teachers page</div>
      <div className="py-4 flex items-center justify-between">
        <Input placeholder="Поиск..." className="w-auto" />
        <Button onClick={() => setIsAddTeacherOpen(true)}>
          <CirclePlus />
          Добавить
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader></TableHeader>
        </Table>
      </div>
    </div>
    <ManageTeacher open={isAddTeacherOpen} onClose={() => setIsAddTeacherOpen(false)} />
    </>
  );
};

export const Component = Teachers;
