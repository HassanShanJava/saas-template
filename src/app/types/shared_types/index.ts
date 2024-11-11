export interface BankDetail {
  bank_name?: string;
  iban_no?: string;
  acc_holder_name?: string;
  swift_code?: string;
}

export interface ApiResponse {
  status_code: number;
  id: number;
  message: string;
}

export interface DeleteResponse {
  status: number;
  detail: string;
}
