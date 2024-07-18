// import React, { useEffect, useState } from "react";
// import {
//   ColumnDef,
//   PaginationState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import { useToast } from "@/components/ui/use-toast";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DoubleArrowLeftIcon,
//   DoubleArrowRightIcon,
// } from "@radix-ui/react-icons";
// import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
// import {
//   creditDetailsTablestypes,
//   creditTablestypes,
//   ErrorType,
// } from "@/app/types";
// import { RootState } from "@/app/store";
// import { useSelector } from "react-redux";
// import { Spinner } from "@/components/ui/spinner/spinner";
// import { useGetCreditsQuery } from "@/services/creditsApi";
// import { Search } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";

// export default function CreditsTableView() {
//   const orgId =
//     useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
//   const { data: creditsData, isLoading, refetch } = useGetCreditsQuery(orgId);

//   const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//   };

//   const creditstableData = React.useMemo(() => {
//     return Array.isArray(creditsData) ? creditsData : [];
//   }, [creditsData]);

//   const { toast } = useToast();

//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [filterID, setFilterID] = useState({});
//   const [filters, setFilters] = useState<any>();
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [isClear, setIsClear] = useState(false);
//   const [clearValue, setIsClearValue] = useState({});
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10, // Adjust this based on your preference
//   });
//   // const displayValue = (value: any) => (value === null ? "N/A" : value);

//   const columns: ColumnDef<creditDetailsTablestypes>[] = [
//     {
//       id: "select",
//       maxSize: 50,
//       size: 50,
//       minSize: 50,
//       header: ({ table }) => (
//         // <div className="text-right w-2">
//         <Checkbox
//           checked={table.getIsAllPageRowsSelected()}
//           onCheckedChange={(value: any) =>
//             table.toggleAllPageRowsSelected(!!value)
//           }
//           aria-label="Select all"
//           className="translate-y-[2px] "
//         />
//         // </div>
//       ),
//       cell: ({ row }) => (
//         // <div className="">

//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value: any) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//           className="translate-y-[2px]"
//         />
//         // </div>
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "name",
//       header: ({ table }) => <p>Credit Name</p>,
//       cell: ({ row }) => {
//         return <p>{row.original.name}</p>;
//       },
//       enableSorting: false,
//       enableHiding: false,
//     },

//     {
//       id: "credits_include",
//       header: "Credits Included",
//       maxSize: 100,
//       cell: ({ row }) => (
//         <Input type="number" min={1} className="number-input w-14" />
//       ),
//     },
//     {
//       id: "validity",
//       header: "Validity",
//       maxSize: 100,
//       cell: ({ row }) => (
//         <Select >
//           <SelectTrigger name="contract_duration" className="-z-20">
//             <SelectValue placeholder="Select contract duration" />
//           </SelectTrigger>

//           <SelectContent >
//             <SelectItem value={"1"}>Monthly</SelectItem>
//             <SelectItem value={"3"}>Quarterly</SelectItem>
//             <SelectItem value={"6"}>Bi-Annually</SelectItem>
//             <SelectItem value={"12"}>Yearly</SelectItem>
//           </SelectContent>
//         </Select>
//       ),
//     },
//   ];

//   const table = useReactTable({
//     data: creditstableData as creditTablestypes[],
//     columns,
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       pagination,
//       sorting,
//       columnVisibility,
//       rowSelection,
//     },
//     initialState: {
//       pagination: {
//         pageSize: 10, // Set your default page size here
//       },
//     },
//     onPaginationChange: setPagination,
//   });

//   function handlePagination(page: number) {
//     if (page < 0) return;
//     // setFilters
//   }

//   return (
//     <div className="w-full space-y-4">
//       <div className="flex items-center justify-between ">
//         <div className="flex flex-1 items-center  ">
//           <div className="flex flex-1 items-center gap-4 ">
//             <h1 className="font-semibold text-[#2D374] text-xl">
//               Credit details
//             </h1>

//             <div className="flex items-center  gap-2 px-3 py-2 rounded-md border border-gray-300 focus-within:border-primary focus-within:ring-[1] ring-primary">
//               <Search className="w-[14px] h-[14px] text-gray-400 m-auto " />
//               <input
//                 placeholder="Search by Name"
//                 value={
//                   (table.getColumn("name")?.getFilterValue() as string) ?? ""
//                 }
//                 onChange={(event) =>
//                   table.getColumn("name")?.setFilterValue(event.target.value)
//                 }
//                 className="h-7  outline-none"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="rounded-none  ">
//         <ScrollArea className="w-full relative">
//           <ScrollBar orientation="horizontal" />
//           <Table
//             className=""
//             containerClassname="h-fit max-h-80 overflow-y-auto relative custom-scrollbar"
//           >
//             <TableHeader className="bg-gray-100 sticky top-0 ">
//               {table?.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => {
//                     return (
//                       <TableHead
//                         key={header.id}
//                         style={{
//                           minWidth: header.column.columnDef.size,
//                           maxWidth: header.column.columnDef.size,
//                         }}
//                       >
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                       </TableHead>
//                     );
//                   })}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody className="">
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-24 text-center -z-30"
//                   >
//                     <Spinner className="text-primary">
//                       <span className="text-primary">
//                         Loading data for clients....
//                       </span>
//                     </Spinner>
//                   </TableCell>
//                 </TableRow>
//               ) : table.getRowModel().rows.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     data-state={row.getIsSelected() && "selected"}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : creditstableData.length > 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-24 text-center"
//                   >
//                     No data found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-24 text-center"
//                   >
//                     No Clients Added yet!.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </ScrollArea>
//       </div>
//       <div className="flex items-center justify-end space-x-2 px-4 py-4">
//         <div className="flex-1 flex w-[100px] items-center justify-start text-sm font-medium">
//           {/* Page {filters.first + 1} of{" "}
//           {Math.ceil((data?.count ?? 0) / filters.rows)} */}
//         </div>

//         <div className="flex items-center justify-center space-x-6 lg:space-x-8">
//           <div className="flex items-center space-x-2">
//             <p className="text-sm font-medium">Rows per page</p>
//             {/* <Select
//               // value={`${filters.rows}`}
//               onValueChange={(value) => {
//                 setFilters((prevFilters: any) => ({
//                   ...prevFilters,
//                   rows: Number(value),
//                   first: 0,
//                 }));
//                 table.setPageSize(Number(value));
//               }}
//             >
//               <SelectTrigger className="h-8 w-[70px]">
//                 <SelectValue defaultValue={pagination.pageSize} />
//               </SelectTrigger>
//               <SelectContent side="top">
//                 {[5, 10, 20, 30, 40, 50].map((pageSize) => (
//                   <SelectItem key={pageSize} value={`${pagination}`} >
//                     {pageSize}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select> */}
//             {/* <Select
//               value="10"
//               onValueChange={(value) => {
//                 setFilters((prevFilters: any) => ({
//                   ...prevFilters,
//                   rows: Number(value),
//                   first: 0,
//                 }));
//                 table.setPageSize(Number(value));
//               }}
//             >
//               <SelectTrigger className="h-8 w-[70px]">
//                 <SelectValue>{10}</SelectValue>
//               </SelectTrigger>
//               <SelectContent side="top">
//                 {[5, 10, 20, 30, 40, 50].map((pageSize) => (
//                   <SelectItem key={pageSize} value={`${pageSize}`}>
//                     {pageSize}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select> */}
//             <Select
//               value={pagination.pageSize.toString()}
//               onValueChange={(value) => {
//                 const newSize = Number(value);
//                 setPagination((prevPagination) => ({
//                   ...prevPagination,
//                   pageSize: newSize,
//                 }));
//                 setFilters((prevFilters: any) => ({
//                   ...prevFilters,
//                   rows: newSize,
//                   first: 0,
//                 }));
//                 table.setPageSize(newSize);
//               }}
//             >
//               <SelectTrigger className="h-8 w-[70px]">
//                 <SelectValue>{pagination.pageSize}</SelectValue>
//               </SelectTrigger>
//               <SelectContent side="top">
//                 {[5, 10, 20, 30, 40, 50].map((pageSize) => (
//                   <SelectItem key={pageSize} value={pageSize.toString()}>
//                     {pageSize}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Button
//               variant="outline"
//               className="hidden h-8 w-8 p-0 lg:flex"
//               onClick={() => handlePagination(0)}
//               // disabled={filters.first === 0}
//             >
//               <span className="sr-only">Go to first page</span>
//               <DoubleArrowLeftIcon className="h-4 w-4" />
//             </Button>

//             <Button
//               variant="outline"
//               className="h-8 w-8 p-0"
//               // onClick={() => handlePagination(filters?.first - 1)}
//               // disabled={filters?.first === 0}
//             >
//               <span className="sr-only">Go to previous page</span>
//               <ChevronLeftIcon className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="outline"
//               className="h-8 w-8 p-0"
//               // onClick={() => handlePagination(filters.first + 1)}
//               // disabled={
//               //   (filters.first + 1) * filters.rows > (data?.count ?? 0) ||
//               //   Math.ceil((data?.count ?? 0) / filters.rows) ==
//               //     filters.first + 1
//               // }
//             >
//               <span className="sr-only">Go to next page</span>
//               <ChevronRightIcon className="h-4 w-4" />
//             </Button>

//             <Button
//               variant="outline"
//               className="hidden h-8 w-8 p-0 lg:flex"
//               // onClick={() =>
//               //   handlePagination(
//               //     Math.ceil((data?.count ?? 0) / filters.rows) - 1
//               //   )
//               // }
//               // disabled={
//               //   (filters.first + 1) * filters.rows > (data?.count ?? 0) ||
//               //   Math.ceil((data?.count ?? 0) / filters.rows) ==
//               //     filters.first + 1
//               // }
//             >
//               <span className="sr-only">Go to last page</span>
//               <DoubleArrowRightIcon className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* <LoadingDialog open={isLoading} text={"Loading data..."} /> */}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useToast } from "@/components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  creditDetailsTablestypes,
  creditTablestypes,
  ErrorType,
} from "@/app/types";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useGetCreditsQuery } from "@/services/creditsApi";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function CreditsTableView() {
  const orgId =
    useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
  const { data: creditsData, isLoading, refetch } = useGetCreditsQuery(orgId);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  };

  const creditstableData = React.useMemo(() => {
    return Array.isArray(creditsData) ? creditsData : [];
  }, [creditsData]);

  const { toast } = useToast();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterID, setFilterID] = useState({});
  const [filters, setFilters] = useState<any>();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isClear, setIsClear] = useState(false);
  const [clearValue, setIsClearValue] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // Adjust this based on your preference
  });

  const columns: ColumnDef<creditDetailsTablestypes>[] = [
    {
      id: "select",
      maxSize: 50,
      size: 50,
      minSize: 50,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="translate-y-[2px] "
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
    },
    {
      accessorKey: "name",
      header: ({ table }) => <p>Credit Name</p>,
      cell: ({ row }) => {
        return <p>{row.original.name}</p>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "credits_include",
      header: "Credits Included",
      maxSize: 100,
      cell: ({ row }) => (
        row.getIsSelected() ? (
          <Input type="number" min={1} className="number-input w-14" />
        ) : null
      ),
    },
    {
      id: "validity",
      header: "Validity",
      maxSize: 100,
      cell: ({ row }) => {
       return row.getIsSelected() ? (
          <Select>
            <SelectTrigger name="contract_duration" className="bg-white">
              <SelectValue placeholder="Select contract duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"1"}>Monthly</SelectItem>
              <SelectItem value={"3"}>Quarterly</SelectItem>
              <SelectItem value={"6"}>Bi-Annually</SelectItem>
              <SelectItem value={"12"}>Yearly</SelectItem>
            </SelectContent>
          </Select>
        ) : null
      },
    },
  ];

  const table = useReactTable({
    data: creditstableData as creditTablestypes[],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10, // Set your default page size here
      },
    },
    onPaginationChange: setPagination,
  });

  function handlePagination(page: number) {
    if (page < 0) return;
    // setFilters
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between ">
        <div className="flex flex-1 items-center  ">
          <div className="flex flex-1 items-center gap-4 ">
            <h1 className="font-semibold text-[#2D374] text-xl">
              Credit details
            </h1>

            <div className="flex items-center  gap-2 px-3 py-1 rounded-md border text-sm border-gray-300 focus-within:border-primary focus-within:ring-[1] ring-primary">
              <Search className="w-[14px] h-[14px] text-gray-400 m-auto " />
              <input
                placeholder="Search by Name"
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="h-7  outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-none  ">
        <ScrollArea className="w-full relative">
          <ScrollBar orientation="horizontal" />
          <Table
            className=""
            containerClassname="h-fit max-h-80 overflow-y-auto relative custom-scrollbar "
          >
            <TableHeader className="bg-gray-100 sticky top-0 z-50">
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          minWidth: header.column.columnDef.size,
                          maxWidth: header.column.columnDef.size,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="">
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center "
                  >
                    <Spinner className="text-primary">
                      <span className="text-primary">
                        Loading data for clients....
                      </span>
                    </Spinner>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : creditstableData.length > 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      {/* pagination */}
      {/* <div className="flex items-center justify-end gap-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length} row(s)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
    </div>
  );
}
