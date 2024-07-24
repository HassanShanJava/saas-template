export const StepperFormKeys = {
    1: ['name', 'group_id', 'description','status', 'access_time','access_type',"limited_access_data", 'duration_type','duration_no','org_id','created_by'],
    2: ['net_price', 'discount', 'income_category_id', 'tax_rate','tax_amount','total_price','payment_method','reg_fee','billing_cycle'],
    3: ['auto_renewal','prolongation_period','days_before','next_invoice','renewal_details'], 
    4: ['facilities',"id"],
  } as const;   