enum genderEnum {
    male = "male",
    female = "female",
    other = "other",
    prefer_no_to_say = "prefer not to say",
  }
  
export interface SellItem {
    item_id: number;
    item_type: string;
    description: string;
    quantity: number;
    price: number;
    tax_type: string;
    tax_name: string;
    tax_rate: number;
    discount: number;
    sub_total: number;
    total: number;
    tax_amount: number;
  }
  
  export interface Payments {
    payment_method_id: number;
    payment_method: string;
    amount: number;
  }
  
  export interface SellForm {
    id?: number;
    counter_id: number;
    discount_amt?: number;
    batch_id?: number | null;
    member_id?: number | null;
    member_name?: string | null;
    member_email?: string | null;
    member_address?: string | null;
    member_gender?: genderEnum | null;
    member_nic?: string;
    notes?: string;
    staff_id?: number | null;
    staff_name?: string;
    receipt_number?: string;
    tax_number?: number | null;
    total?: number | null;
    subtotal?: number | null;
    tax_amt?: number | null;
    main_transaction_id?: number | null;
    status?: "Unpaid" | "Paid" | "Partially Paid";
    transaction_type?: "Refund" | "Sale";
    transaction_date?: Date;
    items?: SellItem[];
    membership_plans?: SellItem[];
    events?: SellItem[];
    products?: SellItem[];
    payments?: Payments[];
    created_by: number;
    updated_at?: number;
  }
  
  export interface TransactionTable {
    data: SellForm[];
    filtered_counts: number;
    total_counts: number;
  }


  export interface CreateTransaction {
    batch_id: number;
    member_id: number;
    member_name: string;
    member_email: string;
    member_address: string;
    member_gender: string;
    staff_id: number;
    staff_name: string;
    receipt_number: string;
    notes: string;
    tax_number: number;
    total_amount: number;
    status: string;
    transaction_type: string;
    products: {
      item_id: number;
      description: string;
      quantity: number;
      price: number;
      tax_rate: number;
      discount: number;
      sub_total: number;
      total: number;
      tax_amount: number;
    }[];
    membership_plans: {
      item_id: number;
      description: string;
      quantity: number;
      price: number;
      tax_rate: number;
      discount: number;
      sub_total: number;
      total: number;
      tax_amount: number;
    }[];
    events: {
      item_id: number;
      description: string;
      quantity: number;
      price: number;
      tax_rate: number;
      discount: number;
      sub_total: number;
      total: number;
      tax_amount: number;
    }[];
  }
  