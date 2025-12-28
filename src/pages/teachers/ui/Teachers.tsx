import { Button } from "@/shared/ui/kit/button";
import { Input } from "@/shared/ui/kit/input";
import { CirclePlus } from "lucide-react";
import { ManageTeacher } from "./ManageTeacher";
import { useState } from "react";
import { getTeachers, handleCreateTeacher } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TeachersTable } from "./components/TeachersTable";

const Teachers = () => {
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const createTeacherMutation = useMutation({
    mutationFn: handleCreateTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setIsAddTeacherOpen(false);
    },
  });

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
          <TeachersTable data={data?.data} />
        </div>
      </div>
      <ManageTeacher
        open={isAddTeacherOpen}
        onClose={() => setIsAddTeacherOpen(false)}
        onSubmit={createTeacherMutation.mutateAsync}
      />
    </>
  );
};

export const Component = Teachers;
