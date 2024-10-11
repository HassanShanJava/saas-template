import {
  CoachTableDataTypes,
  MemberTableDatatypes,
  RegisterSession,
  staffTypesResponseList,
} from "@/app/types";
import Papa from "papaparse";
import { formatInTimeZone } from "date-fns-tz";
export const displayDate = (value: any) => {
  if (!value) return "N/A";
  const utcDate = new Date(value);
  const pkOffset = 5 * 60;
  const localTime = new Date(utcDate.getTime() + pkOffset * 60 * 1000);
  return formatInTimeZone(localTime, "Asia/Karachi", "dd-MMM-yyyy");
};

export const displayDateTime = (value: any) => {
  if (!value) return "N/A";
  const utcDate = new Date(value);
  const pkOffset = 5 * 60;
  const localTime = new Date(utcDate.getTime() + pkOffset * 60 * 1000);
  return formatInTimeZone(localTime, "Asia/Karachi", "dd-MMM-yyyy hh:mma");
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
  "Member Name": `${capitalizeFirstLetter(member.first_name || "")} ${capitalizeFirstLetter(member.last_name || "")}`,
  "Business Name": capitalizeFirstLetter(member.business_name || ""),
  // "Membership Plan": capitalizeFirstLetter(
  //   member.membership_plan_id?.toString() || ""
  // ),
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

export const sessionMapper = ({
  id,
  opening_time,
  opening_balance,
  closing_time,
  closing_balance,
  discrepancy,
  notes,
  created_by,
  created_date,
}: RegisterSession) => ({
  "Session ID": id,
  "Opening Time": displayDateTime(opening_time) || "",
  "Opening Balance": displayValue(opening_balance?.toString()) || "",
  "Closing Time": displayDateTime(closing_time) || "",
  "Closing Balance": displayValue(closing_balance?.toString()) || "",
  Discrepancy: displayValue(discrepancy?.toString()) || "",
  Notes: capitalizeFirstLetter(notes?.toString() || "N/A"),
  "Created By": capitalizeFirstLetter(created_by),
  "Created Date": displayDateTime(created_date) || "",
});

export const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  sort_key: "id",
};

export const displayValue = (value: string | undefined | null) => {
  console.log(value === null || value == undefined || value.trim() == "", {
    value,
  });
  return value === null || value == undefined || value.trim() == ""
    ? "N/A"
    : value;
};

// Function to extract all links
export function extractLinks(data: any[]) {
  let links: string[] = [];

  data.forEach((item: any) => {
    if (item.link && item.link != "/") {
      links.push(item.link); // Add current link
    }

    // Recursively extract links from children if any
    if (item.children && item.children.length > 0) {
      links = links.concat(extractLinks(item.children));
    }
  });

  return links;
}

export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const formatDate = (date: Date | string | null): string | null => {
  if (!date) return null; // Handle null or undefined dates

  const d = new Date(date);

  // Check if the date is valid
  if (isNaN(d.getTime())) {
    console.error("Invalid date:", date);
    return null; // Return null for invalid dates
  }

  const year: number = d.getFullYear();
  const month: string = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day: string = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const roundToTwoDecimals = (value:any) => Math.floor(value * 100) / 100;