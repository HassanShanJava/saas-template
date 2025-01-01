import Papa from "papaparse";
import { formatInTimeZone } from "date-fns-tz";
import { JwtPayload } from "@/app/types/shared_types";
import { SignJWT } from "jose";
import { LimitedAccessTime, staffTypesResponseList } from "@/app/types";
const { VITE_JWT_EXPIRATION, VITE_JWT_Secret_Key } = import.meta.env;

// Your secret key as a TextEncoder-encoded Uint8Array for the browser
const secret = new TextEncoder().encode(VITE_JWT_Secret_Key);

// Function to create a JWT with strict typing
export async function createJWT(
  payload: JwtPayload,
  expiration = VITE_JWT_EXPIRATION
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiration)
    .sign(secret);
}

export const daysOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

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

export const displayAddress = (
  address_1?: string | null,
  address_2?: string | null,
  zipCode?: string | null,
  country?: string | null
): string => {
  const parts = [address_1, address_2, zipCode, country];

  // Filter out null, undefined, or empty strings
  const filteredParts = parts.filter(part => part && part.trim());

  // If no valid parts, return "N/A"
  return filteredParts.length > 0 ? filteredParts.join(", ") : "N/A";
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

export function replaceUnderscoreWithSpace(inputString: string) {
  return inputString.replace(/_/g, " "); // Replace all underscores with spaces
}
export const capitalizeFirstLetter = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;





export const initialValue = {
  limit: 10,
  offset: 0,
  sort_order: "desc",
  sort_key: "id",
};

export const displayValue = (value: string | number | undefined | null) => {
  return value === null ||
    value == undefined ||
    (typeof value == "string" && value.trim() == "")
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

export const formatNIC = (value?: string) => {
  // Return null if the value is empty, null, or undefined
  if (!value) {
    return null;
  }

  const numericValue = value.replace(/\D/g, "");

  // Add dashes at positions 5 and 12 if length allows
  if (numericValue.length <= 5) {
    return numericValue;
  } else if (numericValue.length <= 12) {
    return `${numericValue.slice(0, 5)}-${numericValue.slice(5)}`;
  } else {
    return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 12)}-${numericValue.slice(12, 13)}`;
  }
};
export const roundToTwoDecimals = (value: number) =>
  Math.floor(value * 100) / 100;

export const inValidToken = (token: string | undefined) => {
  return token !== undefined && token.trim().length > 0;
};

export const formatToPKR = (amount: number | null | undefined) => {
  if (!amount) {
    return "N/A"
  }

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
  })
    .format(amount)
    .replace("PKR", "Rs. ");
};

export function cleanLimitedAccessTime(
  limitedAccessTime: LimitedAccessTime
): LimitedAccessTime {
  const cleanedAccessTime: LimitedAccessTime = {};

  for (const [day, timeSlots] of Object.entries(limitedAccessTime)) {
    const filteredSlots = timeSlots.filter(
      (slot) => slot.from_time !== "" || slot.to_time !== ""
    );

    if (filteredSlots.length > 0) {
      cleanedAccessTime[day] = filteredSlots;
    }
  }

  return cleanedAccessTime;
}

export const replaceNullWithDefaults = (
  data: LimitedAccessTime
): LimitedAccessTime =>
  daysOrder.reduce(
    (acc, day) => ({
      ...acc,
      [day]: data[day] ?? [{ from_time: "", to_time: "" }],
    }),
    {} as LimitedAccessTime
  );

  export function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  
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