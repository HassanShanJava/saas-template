export interface LinkedMembersInvoiceItem {
    membership_plan_id: number;
    transaction_id: number;
    updated_at: string;       // Using string for date-time, could be parsed as Date later
    is_deleted: boolean;
    member_id: number;
    created_at: string;       // Using string for date-time
    id: number;
    created_by: number;
    updated_by: number | null; // Optional due to possible `null` values
    membership_plan_name: string;
}

export interface LinkedMembersInvoiceDataResponse {
    data: LinkedMembersInvoiceItem[];
    total_counts: number;
    filtered_counts: number;
}

export interface LinkedMembers {
    member_id: number;
    member_plan_id: number;
    transaction_id: number;
  }
