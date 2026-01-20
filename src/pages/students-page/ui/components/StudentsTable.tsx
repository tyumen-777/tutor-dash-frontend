import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { TStudent } from "@/shared/student";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/kit/table.tsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { generatePath, Link } from "react-router-dom";
import { EditTableMenu } from "./EditTableMenu";
import { APP_ROUTES } from "@/shared/model";

dayjs.extend(utc);

type TableMeta = {
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
};

const columns: ColumnDef<TStudent>[] = [
  {
    id: "fullName",
    header: "ФИО",
    cell: (info) => (
      <Link to={generatePath(APP_ROUTES.STUDENT, { id: String(info.row.original.id) })}>
        <span className="text-blue-500 hover:underline">{info.row.original.firstName} {info.row.original.lastName}</span>
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Почта",
    // cell: (info) => info.getValue(),
  },
  {
    accessorKey: "phone",
    header: "Телефон",
    // cell: (info) => info.getValue(),
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
        <EditTableMenu
          onEdit={onEdit}
          onDelete={onDelete}
          id={info.row.original.id}
        />
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
      const firstName = row.original.firstName?.toLowerCase() ?? "";
      const lastName = row.original.lastName?.toLowerCase() ?? "";
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
