import { ClientTable } from "./component/clienttable";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { generateData } from "./component/data/data";
import DataTable from "./component/data-table";

const data = generateData(100);

const columns: ColumnDef<any, any>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];

const Client = () => {
  return (
    <div className="bg-background w-full h-full p-10">
      {/* <ClientTable /> */}
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default Client;
