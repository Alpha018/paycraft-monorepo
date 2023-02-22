export interface productOrder {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number;
  order_address_id: number;
  name: string;
  name_customer: string;
  name_merchant: string;
  sku: string;
  upc: string;
  type: string;
  base_price: string;
  price_ex_tax: string;
  price_inc_tax: string;
  price_tax: string;
  base_total: string;
  total_ex_tax: string;
  total_inc_tax: string;
  total_tax: string;
  weight: string;
  width: string;
  height: string;
  depth: string;
  quantity: number;
  base_cost_price: string;
  cost_price_inc_tax: string;
  cost_price_ex_tax: string;
  cost_price_tax: string;
  is_refunded: boolean;
  quantity_refunded: number;
  refund_amount: string;
  return_id: number;
  wrapping_id: number;
  wrapping_name: string;
  base_wrapping_cost: string;
  wrapping_cost_ex_tax: string;
  wrapping_cost_inc_tax: string;
  wrapping_cost_tax: string;
  wrapping_message: string;
  quantity_shipped: number;
  event_date: string;
  fixed_shipping_cost: string;
  ebay_item_id: string;
  ebay_transaction_id: string;
  is_bundled_product: boolean;
  bin_picking_number: string;
  fulfillment_source: string;
  brand: string;
}