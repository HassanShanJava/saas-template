import { UserStatus } from "../shared_enums/enums";
import { TableResponse, User } from "./shared_types";

export interface Staff extends User {
  role_id: number;
  status: UserStatus;
}


export type StaffTable = TableResponse<Staff>;