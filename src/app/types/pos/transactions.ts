// types for get invoice for members
export interface TransactionData {
    data: Transaction[];
    total_counts: number;
    filtered_counts: number;
  }
  
  export  interface Transaction {
    id: number;
    member_id: number;
    member_name: string;
    transaction_date: string;
    main_transaction_id: number | null;
    receipt_number: string;
    transaction_type: string;
    status: string;
    transaction_details: TransactionDetail[];
    payment_details: PaymentDetail[];
    added_member_ids: number[] | null;
    total_quantity: number;
    total_amount: number;
  }
  
  export interface TransactionDetail {
    id: number;
    transaction_id: number;
    item_id: number;
    quantity: number;
    description: string;
    item_type: string;
    assigned_members: number[];
    total: number;
  }
  
  export  interface PaymentDetail {
    id: number;
    transaction_id: number;
    payment_method_id: number;
    payment_method: string;
    amount: number;
  }
  