import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Transaction } from "@/app/types/pos/transactions";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MemberForm from "../../../memberForm/form";
import { MemberTableDatatypes } from "@/app/types/member";
import { useGetAllMemberQuery } from "@/services/memberAPi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Combobox from "@/components/ui/common/combobox";
import { toast } from "@/components/ui/use-toast";
import { ErrorType } from "@/app/types";
import { useAddLinkedMembersMutation } from "@/services/invoiceApi";
import { LinkedMembers } from "@/app/types/pos/invoice";

interface LinkedMembersProps {
  isOpen: boolean;
  setOpen: any;
  selectTransaction: Transaction | undefined;
  setSelectedTransaction: Dispatch<SetStateAction<Transaction | undefined>>,
}

const LinkedMembersPage = ({
  isOpen,
  setOpen,
  selectTransaction,
  setSelectedTransaction
}: LinkedMembersProps) => {

  console.log({ selectTransaction })

  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: memberTableList, refetch: memberRefetch } = useGetAllMemberQuery({ org_id: orgId, query: `sort_key=id&sort_order=desc&business_id=${selectTransaction?.member_id}` })
  const [action, setAction] = useState<"add" | "edit">("add")
  const [openMemberForm, setOpenMemberForm] = useState<boolean>(false)
  const [editMember, setEditMember] = useState<MemberTableDatatypes | null>(
    null
  );

  const memberList = useMemo(() => {
    return Array.isArray(memberTableList?.data) ? memberTableList?.data : [];
  }, [memberTableList]);

  // payload
  const [payloadLinkedMembers, setPayloadLinkedMembers] = useState<LinkedMembers[]>([])
  const [addLinkedMember, result] = useAddLinkedMembersMutation()
  console.log({ result,payloadLinkedMembers })
  function handleOpenForm() {
    setAction("add");
    setEditMember(null);
    setOpenMemberForm(true);
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(undefined);
  };

  const handleSelectMember = (id: string, plan_id: number, transaction_id: number) => {
    setPayloadLinkedMembers((prev) => ([
      ...prev,
      {
        member_id: Number(id),
        member_plan_id: plan_id,
        transaction_id: transaction_id,
      }
    ] as LinkedMembers[]))
  };


  const memberCombobox = memberList.map((member) => ({ value: member.id + "", label: member.first_name + " " + member.last_name }))

  const onSave = async () => {
    console.log("issue")
    try {
      const resp = await addLinkedMember(payloadLinkedMembers).unwrap();
      console.log({ resp })
      if (resp) {
        toast({
          variant: "success",
          title: "Members Linked Successfully",
        });

      }
    } catch (error) {
      console.error("Error", { error });
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `${typedError.data?.detail}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent hideCloseButton className="w-full !max-w-[500px] flex flex-col custom-scrollbar p-0 bg-[#F8F9FA]">
        <SheetHeader className="  p-4 bg-white flex flex-row gap-1 items-center justify-between  sticky top-0 border border-b-1 ">
          <div className="flex gap-2">

            <Button onClick={handleClose} className="border-transparent hover:bg-transparent p-0 pr-2 m-0 bg-transparent">
              <X className="text-black" />
            </Button>
            <div>
              <SheetTitle className="py-0 text-nowrap">Linked Members and Seats</SheetTitle>
              <p className="m-0 py-0 text-sm">Total seats: {selectTransaction?.total_quantity}</p>
            </div>
          </div>
          <div className="flex gap-2">


            <Button onClick={handleOpenForm} className="w-[60px] text-black h-9 ">
              Add
            </Button>
            <Button onClick={() => onSave} className="w-[60px] text-black h-9 ">
              Save
            </Button>
          </div>
        </SheetHeader>
        <SheetDescription className="px-4 pb-4 space-y-4 ">

          <Accordion type="multiple" className="w-full space-y-4">
            {selectTransaction?.transaction_details.map((transaction, i) => (
              <AccordionItem key={transaction.description} value={transaction.description} className="">
                <AccordionTrigger className="!bg-white no-underline px-4 hover:no-underline !rounded-t-md ">
                  <div className="flex flex-row w-full justify-between items-start !bg-white">
                    <p className="capitalize text-sm">{transaction.description}</p>
                    <p className="text-sm font-normal">
                      Seats: <span className="text-gray-400">{transaction.quantity}</span>
                    </p>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="!bg-white !rounded-b-md">
                  <Separator className="w-[95%] py-[1px] mx-auto !text-gray-800" />

                  {/* Generate the quantity list specific to this transaction */}
                  <div className="px-4">
                    {Array.from({ length: transaction.quantity }, (_, qtyIndex) => qtyIndex + 1).map((num) => (
                      <div className="flex gap-2 items-center  py-2" key={`${transaction.transaction_id}-${num}`} >
                        <p>{num}.</p>
                        <Combobox
                          defaultValue={transaction.assigned_members[i] + ""}
                          setFilter={(value: string) => handleSelectMember(value, transaction.item_id, transaction.transaction_id)}
                          list={memberCombobox}
                          label={"Member"}
                        />
                        <i
                          className="fa-regular fa-trash-can cursor-pointer text-red-500"
                        // onClick={() => handleDelete(day, index)}
                        ></i>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}

          </Accordion>

          <MemberForm
            open={openMemberForm}
            setOpen={setOpenMemberForm}
            memberData={editMember}
            setMemberData={setEditMember}
            action={action}
            setAction={setAction}
            refetch={memberRefetch}
            breadcrumb="Member Details"
          />
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default LinkedMembersPage;
