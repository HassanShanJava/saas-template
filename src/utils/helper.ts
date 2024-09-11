import {
  CoachTableDataTypes,
  MemberTableDatatypes,
  staffTypesResponseList,
} from "@/app/types";
import Papa from "papaparse";
export const displayDate = (value: any) => {
  if (value == null) return "N/A";

  const date = new Date(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const displayDateTime = (value: any) => {
  if (value == null) return "N/A";

  const date = new Date(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const downloadCSV = <T>(
  data: T[],
  fileName: string,
  mapper: (item: T) => object
) => {
  const filteredData = data.map(mapper);

  const csv = Papa.unparse(filteredData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const capitalizeFirstLetter = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
export const membersMapper = (member: MemberTableDatatypes) => ({
  "Member Id": member.own_member_id,
  "Member Name": `${capitalizeFirstLetter(member.first_name?.toUpperCase() || "")} ${capitalizeFirstLetter(member.last_name?.toUpperCase() || "")}`,
  "Business Name": capitalizeFirstLetter(member.business_name || ""),
  "Membership Plan": capitalizeFirstLetter(
    member.membership_plan_id?.toString() || ""
  ),
  Status: capitalizeFirstLetter(member.client_status || ""),
  "Activation Date": displayDate(member.activated_on) || "",
  "Last Check In": displayDateTime(member.check_in) || "",
  "Last Login": displayDateTime(member.last_online) || "",
});

export const staffMapper = ({
  own_staff_id,
  first_name,
  last_name,
  activated_on,
  status,
  role_name,
  last_checkin,
  last_online,
}: staffTypesResponseList) => ({
  "Staff Id": own_staff_id,
  "Staff Name": `${capitalizeFirstLetter(first_name || "")} ${capitalizeFirstLetter(last_name || "")}`,
  "Activation Date": displayDate(activated_on) || "",
  Role: capitalizeFirstLetter(role_name || ""),
  Status: capitalizeFirstLetter(status || "") || "",
  "Last Check In": displayDateTime(last_checkin) || "",
  "Last Login": displayDateTime(last_online) || "",
});
export const coachMapper = ({
  own_coach_id,
  first_name,
  last_name,
  activated_on,
  coach_status,
  check_in,
  last_online,
}: CoachTableDataTypes) => ({
  "Coach Id": own_coach_id,
  "Coach Name": `${capitalizeFirstLetter(first_name || "")} ${capitalizeFirstLetter(last_name || "")}`,
  "Activation Date": displayDate(activated_on) || "",
  Status: capitalizeFirstLetter(coach_status || ""),
  "Last Check In": displayDateTime(check_in) || "",
  "Last Login": displayDateTime(last_online) || "",
});

export const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  sort_key: "created_at",
};

export const displayValue = (value: string | undefined | null) =>
  value == null || value == undefined || value.trim() == "" ? "N/A" : value;
