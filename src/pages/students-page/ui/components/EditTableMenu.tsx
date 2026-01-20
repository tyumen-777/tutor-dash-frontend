import { Button } from "@/shared/ui/kit/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/kit/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

type TEditTableMenuProps = {
    onEdit: ((id: number) => void) | undefined
    onDelete: ((id: number) => void) | undefined
    id: number;
}
export const EditTableMenu = ({onEdit, onDelete, id} : TEditTableMenuProps) => {
  return (
    <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="justify-between" onClick={() => onEdit?.(id)}>
              Редактировать
              <Pencil />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="justify-between"
              onClick={() => onDelete?.(id)}
            >
              <span className="text-red-500">Удалить</span>
              <Trash2 color="#fb2c36" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  )
}