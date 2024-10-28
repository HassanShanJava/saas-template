export interface HardwareSettingsConditions {
  show_remaining_credits_enabled: boolean;
  remaining_credits_threshold?: number;
  show_outstanding_invoices_enabled: boolean;
  outstanding_invoice_days?: number;
  show_end_of_contract_enabled: boolean;
  end_of_contract_days?: number;
  no_active_membership_enabled: boolean;
  required_credits_enabled: boolean;
  credits_threshold?: number;
  has_outstanding_invoices_enabled: boolean;
  outstanding_invoices_days_threshold?: number;
  membership_expiry_enabled: boolean;
  membership_ends_in_days?: number;
}
export interface HardwareIntegrationInput {
  name: string;
  description?: string | null;
  org_id: number;
  connection_key: string;
  use_facility: boolean;
  facility_id?: number | null;
  settings: HardwareIntegrationInput;
}
