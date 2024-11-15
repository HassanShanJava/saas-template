export interface LinkedMembersInvoiceItem {
    id: number;
    transaction_id: number;
    member_id: number;
    membership_plan_id: number;
    member_name: string;
    membership_plan_name: string;
    membership_plan_status: string;
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