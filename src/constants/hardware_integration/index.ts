import {
  HardwareIntegrationInput,
  HardwareSettings,
} from "@/app/types/hardware-integration";

export const initialHardwareIntegrationInput: HardwareIntegrationInput = {
  name: "",
  description: "",
  org_id: 0,
  connection_key: "",
  use_facility: false,
  facility_id: null,
  settings: {
    show_remaining_credits_enabled: false,
    remaining_credits_threshold: 0,
    show_outstanding_invoices_enabled: false,
    outstanding_invoice_days: 0,
    show_end_of_contract_enabled: false,
    end_of_contract_days: 0,
    has_no_required_credits: false,
    has_no_active_membership: false,
    // min_credits_required: false,
    // credits_threshold: 0,
    has_outstanding_invoices_enabled: false,
    outstanding_invoices_days_threshold: 0,
    membership_expiry_enabled: false,
    membership_ends_in_days: 0,
  },
};

export function validateHardwareSettings(settings: HardwareSettings): boolean {
  const {
    has_no_active_membership,
    has_no_required_credits,
    // min_credits_required,
    has_outstanding_invoices_enabled,
    membership_expiry_enabled,
  } = settings;

  return (
    has_no_active_membership &&
    has_no_required_credits &&
    // min_credits_required &&
    has_outstanding_invoices_enabled &&
    membership_expiry_enabled
  );
}
