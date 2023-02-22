export interface FormField {
  name: string;
  value: string;
}

export interface Addresses {
  url: string;
  resource: string;
}

export interface Customer {
  id: number;
  company: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  form_fields: FormField[];
  date_created: string;
  date_modified: string;
  store_credit: string;
  registration_ip_address: string;
  customer_group_id: number;
  notes: string;
  tax_exempt_category: string;
  reset_pass_on_login: boolean;
  accepts_marketing: boolean;
  addresses: Addresses;
}
