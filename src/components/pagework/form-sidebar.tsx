import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
// import FormData from "./progressive-form";
export function SideBarForm() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsDrawerOpen(true)}
        className="bg-[#D0FD3E] text-black font-bold gap-3 h-12 hover:bg-[#D0FD3E] hover:opacity-40"
      >
        <PlusIcon className="h-4 w-4 font-bold" />
        Add Client
      </Button>
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-[80vw]">
          {/* <FormData updateParentState={setIsDrawerOpen}/> */}
        </SheetContent>
      </Sheet>
    </>
  );
}
