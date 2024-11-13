import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction } from "react";
import { useToast } from "@/components/ui/use-toast";

import { useNavigate } from "react-router-dom";
import { Transaction } from "@/app/types/pos/transactions";
export function DataTableRowActions({
  data,
  access,
  openLinkedMembers
}: {
  data: Transaction;
  access: string;
  openLinkedMembers: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const navigate = useNavigate();


  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={()=>openLinkedMembers(true)} className="text-nowrap">
                <Eye className="mr-2 h-4 w-4" />
                View Linked Members
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>

    </>
  );
}
