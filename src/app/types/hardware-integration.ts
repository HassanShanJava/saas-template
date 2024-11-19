export interface HardwareSettings {
  // check in information to show

  //show credits
  show_remaining_credits_enabled: boolean;
  remaining_credits_threshold?: number;

  //show outstanding invoice
  show_outstanding_invoices_enabled: boolean;
  outstanding_invoice_days?: number;

  //show end of contract/membership
  show_end_of_contract_enabled: boolean;
  end_of_contract_days?: number;

  // check in controls

  //has active membership
  has_no_active_membership: boolean;

  //check required credits
  has_no_required_credits: boolean;

  // //required credits override
  // min_credits_required: boolean;
  // credits_threshold?: number;

  //over dues
  has_outstanding_invoices_enabled: boolean;
  outstanding_invoices_days_threshold?: number;

  //membership expired
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
  settings: HardwareSettings;
}

export interface HardwareIntegrationRow extends HardwareIntegrationInput {
  id: number;
  facility_name?: string | null;
}

export interface HardwareTable {
  data: HardwareIntegrationRow[];
  total_counts: number;
  filtered_counts: number;
}
