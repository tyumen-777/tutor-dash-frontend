import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/shared/ui/kit/dialog";

type TManageTeacherProps = {
    open: boolean;
    onClose: () => void;
}
export const ManageTeacher = ({ open, onClose }: TManageTeacherProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>ManageTeacher</DialogTitle>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
