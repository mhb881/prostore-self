"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const DeleteDialog = ({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteCLick = async () => {
    startTransition(async () => {
      const res = await action(id);
      if (res.success) {
        toast.success(res.message);
        setIsOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="ml-4 cursor-pointer">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>你确定要删除吗？</AlertDialogTitle>
        <AlertDialogDescription>此操作无法撤销。</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">取消</AlertDialogCancel>
          <Button
            variant={"destructive"}
            size="sm"
            disabled={isPending}
            onClick={handleDeleteCLick}
            className="cursor-pointer hover:bg-red-700"
          >
            {isPending ? "删除中..." : "删除"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
