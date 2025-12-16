import { Separator } from "@/shared/ui/kit/separator.tsx";
import { Input } from "@/shared/ui/kit/input.tsx";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/kit/table.tsx";
import { Button } from "@/shared/ui/kit/button.tsx";
import { CirclePlus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/kit/dropdown-menu";
import  ManageStudent  from "./ManageStudent";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/api";

//TODO: вынести типы в entities
type TStudent = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  age: number;
  email: string;
};

const columns: ColumnDef<TStudent>[] = [
  {
    accessorKey: "firstName",
    header: "Имя",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "lastName",
    header: "Фамилия",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "Почта",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "phone",
    header: "Телефон",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "age",
    header: "Возраст",
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    cell: (info) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="justify-between">
              Редактировать
              <Pencil />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="justify-between"
              onClick={() => console.log(info.row.original.id)}
            >
              <span className="text-red-500">Удалить</span>
              <Trash2 color="#fb2c36" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
const getStudents = (): Promise<{ data: TStudent[] }> => {
  return api.get("student");
};

const Students = () => {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data } = useQuery({
    queryKey: ["student"],
    queryFn: getStudents,
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const firstName = row.getValue<string>("firstName")?.toLowerCase() ?? "";
      const lastName = row.getValue<string>("lastName")?.toLowerCase() ?? "";
      const search = filterValue.toLowerCase();
      return firstName.includes(search) || lastName.includes(search);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

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
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Ничего не найдено
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ManageStudent
        open={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />
    </>
  );
};

export const Component = Students;
