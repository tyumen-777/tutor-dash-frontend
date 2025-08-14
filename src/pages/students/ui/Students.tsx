import { Separator } from "@/shared/ui/kit/separator.tsx";
import { Input } from "@/shared/ui/kit/input.tsx";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
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
import { CirclePlus } from "lucide-react";

type TStudent = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  age: number;
  email: string;
};
const fakeData: TStudent[] = [
  {
    name: "Ivan",
    surname: "Ivanov",
    phone: "89220000000",
    age: 0,
    email: "ivanov@gmail.com",
    id: 1,
  },
  {
    name: "Sergei",
    surname: "Sergeev",
    phone: "89220000000",
    age: 0,
    email: "ivanov@gmail.com",
    id: 2,
  },
];
const columnHelper = createColumnHelper<TStudent>();
const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Имя",
  }),
  columnHelper.accessor("surname", {
    cell: (info) => info.getValue(),
    header: "Фамилия",
  }),
  columnHelper.accessor("phone", {
    cell: (info) => info.getValue(),
    header: "Телефон",
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: "Почта",
  }),
  columnHelper.accessor("age", {
    cell: (info) => info.getValue(),
    header: "Возраст",
  }),
];

export const Students = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, _setData] = useState(() => [...fakeData]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <div>
      <div className="py-2">
        <h2>Студенты</h2>
      </div>
      <Separator className="my-4" />
      <div className="py-4 flex items-center justify-between">
        <Input
          placeholder="Поиск студента"
          className="w-auto"
          value={(table.getColumn("surname")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("surname")?.setFilterValue(event.target.value)
          }
        />
        <Button>
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
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
