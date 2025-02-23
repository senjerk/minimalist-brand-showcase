export type OrderStatus = 
  | "WP"  // Waiting Payment
  | "PD"  // Paid
  | "IW"  // In Work
  | "DR"  // Delivery Ready
  | "ID"  // In Delivery
  | "DV"  // Delivered
  | "CN"; // Cancelled

export interface Order {
  id: string;
  status: {
    status: OrderStatus;
    status_display: string;
  };
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
  total_sum?: number;
  trackingCode?: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    color?: string;
    size?: string;
  }[];
  comments?: string[];
}
