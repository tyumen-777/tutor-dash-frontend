import { Separator } from "@/shared/ui/kit/separator.tsx";
import { Input } from "@/shared/ui/kit/input.tsx";

import { useState } from "react";

import { Button } from "@/shared/ui/kit/button.tsx";
import { CirclePlus } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudents, handleDeleteStudent } from "../api";
import { StudentsTable } from "./components/StudentsTable";
import ManageStudent from "./components/ManageStudent";

const Students = () => {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentId, setStudentId] = useState<number | undefined>(undefined);
  const [globalFilter, setGlobalFilter] = useState("");
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });
  
  const deleteStudentMutation = useMutation({
    mutationFn: handleDeleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const handleEditStudent = (id: number) => {
    setIsAddStudentOpen(true);
    setStudentId(id);
  };


  return (
    <>
      <div className="w-full">
        <div className="py-2">
          <h2>Студенты</h2>
        </div>
        <Separator className="my-4" />
        <div className="py-4 flex items-center justify-between">
          <Input
            placeholder="Поиск..."
            className="w-auto"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
          />
          <Button onClick={() => setIsAddStudentOpen(true)}>
            <CirclePlus />
            Добавить
          </Button>
        </div>
        <div className="rounded-md border">
          <StudentsTable
            data={data?.data}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            onDelete={deleteStudentMutation.mutate}
            onEdit={handleEditStudent}
          />
        </div>
      </div>
      <ManageStudent
        open={isAddStudentOpen}
        onClose={() => {
          setIsAddStudentOpen(false);
          setStudentId(undefined);
        }}
        studentId={studentId}
      />
    </>
  );
};

export const Component = Students;
