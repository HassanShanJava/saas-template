import React, { useState, useEffect } from "react";
import { Shell } from "@/components/ui/shell/shell";
import { DataTable } from "./component/data-table";
// import tasksData from "./component/leads.json";

import {
  useGetAllStaffQuery,
  useGetLeadsQuery,
  useUpdateStaffMutation,
  useUpdateStatusMutation,
} from "@/services/leadsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorType } from "@/app/types";
import { toast } from "@/components/ui/use-toast";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
export interface StaffDataType {
  org_id: number;
  id: number;
  first_name: string;
}
export interface LeadType {
  id?: number;
  name: string;
  email: string;
  owner: string;
  status: string;
  source: string;
  lead_since: Date;
  staffData?: StaffDataType[];
}

// status
const statusItems = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in contact", label: "In Contact" },
  { value: "appointment made", label: "Appointment Made" },
  { value: "appointment hold", label: "Appointment Hold" },
  { value: "free trial", label: "Free Trial" },
  { value: "sign up scheduled", label: "Sign Up Scheduled" },
  { value: "no show", label: "No Show" },
  { value: "closed refused", label: "Closed Refused" },
  { value: "closed lost contact", label: "Closed Lost Contact" },
  { value: "closed disqualified", label: "Closed Disqualified" },
  {
    value: "closed thirdparty aggregator",
    label: "Closed Third Party Aggregator",
  },
];

function convertDateToEuropeanFormat(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const Lead: React.FC = () => {
  const [data, setData] = useState<LeadType[]>([]);
  const navigate = useNavigate();
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.org_id) || 0;

  const { data: leadsData, isLoading, refetch } = useGetLeadsQuery(orgId);
  const { data: staffData } = useGetAllStaffQuery(orgId);

  const [updateStatus, { isLoading: statusLoading }] =
    useUpdateStatusMutation();

  const [updateStaff, { isLoading: staffLoading }] = useUpdateStaffMutation();

  useEffect(() => {
    const parseddata: any = leadsData?.map((item) => {
      return {
        ...item,
        staffData,
        actions: "",
      };
    });
    setData(parseddata);
  }, [staffData, leadsData]);

  const updateStaffInput = async (e: { staff_id: number; lead_id: number }) => {
    const payload = e;
    try {
      const resp = await updateStaff(payload).unwrap();
      if (resp) {
        console.log({ resp });
        refetch();
        toast({
          variant: "success",
          title: "Updated Successfully",
        });
      }
    } catch (error: unknown) {
      console.log("Error", error);
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `${typedError.data?.detail}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error in form Submission",
          description: `Something Went Wrong.`,
        });
      }
    }
  };

  const updateStatusInput = async (e: { status: string; lead_id: number }) => {
    const payload = e;

    try {
      const resp = await updateStatus(payload).unwrap();
      if (resp) {
        console.log({ resp });
        refetch();
        toast({
          variant: "success",
          title: "Updated Successfully",
        });
      }
    } catch (error: unknown) {
      console.log("Error", error);
      if (error && typeof error === "object" && "data" in error) {
        const typedError = error as ErrorType;
        toast({
          variant: "destructive",
          title: "Error",
          description: `${typedError.data?.detail}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Something Went Wrong.`,
        });
      }
    }
  };

  const columns: ColumnDef<LeadType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 100,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="max-w-[200px] truncate font-medium">
            {row.getValue("name")}
          </div>
        );
      },
    },
    {
      accessorKey: "mobile",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.getValue("mobile")}</div>
      ),
    },
    {
      accessorKey: "owner",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lead Owner" />
      ),
      cell: ({ row }) => {
        // <div className="max-w-[200px] truncate">
        //   {row.getValue("owner")}
        // </div>
        const staffData = row.original.staffData;
        const id = Number(row.original.id);
        const defaultValue: string = (row.getValue("owner") as string)?.trim();
        return (
          <Select
            defaultValue={defaultValue}
            onValueChange={(e) =>
              updateStaffInput({ staff_id: Number(e), lead_id: id })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Lead Owner" className="text-gray-400" />
            </SelectTrigger>
            <SelectContent>
              {staffData?.map((item) => (
                <SelectItem key={item.id + ""} value={item.id + ""}>
                  {item.first_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const value = row.original.status;
        const id = Number(row.original.id);

        return (
          <Select
            defaultValue={value}
            onValueChange={(e) => updateStatusInput({ status: e, lead_id: id })}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Lead Status"
                className="text-gray-400"
              />
            </SelectTrigger>
            <SelectContent>
              {statusItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "source",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Source" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.getValue("source")}</div>
      ),
    },
    {
      accessorKey: "lead_since",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lead Since" />
      ),
      cell: ({ row }) => {
        const field = convertDateToEuropeanFormat(row.getValue("lead_since"));
        return <div>{field}</div>;
      },
    },
    {
      id: "actions",
      header: ({ column }) => (<p>Actions</p>),
      cell: ({ row }) => {
        const id=row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild >
              <div className="w-full flex justify-center">
              <i className="fas fa-ellipsis-vertical h-4 w-4 text-center"></i>

              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/admin/leads/editlead/${id}`);
                }}
              >
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  console.log({ data });
  return (
    <Shell>
      <DataTable columns={columns} data={data} />
    </Shell>
  );
};

export default Lead;
