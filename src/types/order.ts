
export type OrderStatus = 
  | "pending_payment"
  | "awaiting_confirmation"
  | "processing"
  | "shipping"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
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
