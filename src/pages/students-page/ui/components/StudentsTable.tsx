import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { TStudent } from "@/shared/student";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/kit/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/kit/table.tsx";
import { Button } from "@/shared/ui/kit/button.tsx";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type TableMeta = {
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
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
    accessorKey: "birthDate",
    header: "Дата рождения",
    cell: (info) => {
      const date = info.getValue<string | null>();
      return date ? dayjs.utc(date).format("DD.MM.YYYY") : "";
    },
  },
  {
    id: "actions",
    cell: (info) => {
      const { onDelete, onEdit } = info.table.options.meta as TableMeta;
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="justify-between" onClick={() => onEdit?.(info.row.original.id)}>
              Редактировать
              <Pencil />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="justify-between"
              onClick={() => onDelete?.(info.row.original.id)}
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

type TStudentsTableProps = {
  data?: TStudent[];
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

export const StudentsTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDelete,
  onEdit,
}: TStudentsTableProps) => {
  const table = useReactTable({
    data: data ?? [],
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
    meta: {
      onDelete,
      onEdit,
    },
  });

  return (
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Ничего не найдено
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
