export const StepperFormKeys = {
    1: ['membership_name', 'membership_group', 'description','status', 'access', 'duration'],
    2: ['net_price', 'discount_percentage', 'income_category', 'tax_rate','tax_amount','total_amount','payment_cash','registration_fee','billing_cycle'],
    3: ['auto_renewal','prolongation_period','days_before','next_invoice'], 
    4: ['loanAmount', 'loanPurpose', 'repaymentTerms', 'repaymentStartDate'],
    // 5: ['bankName', 'accountNumber', 'routingNumber', 'creditScore'],
  } as const;   