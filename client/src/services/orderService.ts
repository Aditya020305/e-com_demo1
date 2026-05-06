import API from "../api/axios";

/* ── Types ── */
export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  orderItems: OrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  // RAZORPAY INTEGRATION START
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  // RAZORPAY INTEGRATION END
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
}

/* ── API Calls ── */

export const createOrder = async (
  orderData: CreateOrderPayload
): Promise<OrderResponse> => {
  const { data } = await API.post<OrderResponse>("/orders", orderData);
  return data;
};

export const getMyOrders = async (): Promise<OrdersResponse> => {
  const { data } = await API.get<OrdersResponse>("/orders/my");
  return data;
};

export const getOrderById = async (id: string): Promise<OrderResponse> => {
  const { data } = await API.get<OrderResponse>(`/orders/${id}`);
  return data;
};

/* ── Vendor-specific endpoints ── */

export interface VendorOrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    vendor: string;
  };
  name: string;
  price: number;
  quantity: number;
}

export interface VendorOrder {
  _id: string;
  user: { _id: string; name: string; email: string };
  orderItems: VendorOrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  isReturned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getVendorOrders = async (): Promise<VendorOrder[]> => {
  const { data } = await API.get<{
    success: boolean;
    message: string;
    data: VendorOrder[];
  }>("/orders/vendor");
  return data.data;
};

// RAZORPAY INTEGRATION START
export interface RazorpayOrderResponse {
  success: boolean;
  data: {
    razorpayOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
  };
}

export interface RazorpayVerifyPayload {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const createRazorpayOrder = async (
  orderId: string
): Promise<RazorpayOrderResponse> => {
  const { data } = await API.post<RazorpayOrderResponse>(
    "/payment/create-order",
    { orderId }
  );
  return data;
};

export const verifyRazorpayPayment = async (
  payload: RazorpayVerifyPayload
): Promise<{ success: boolean; message: string }> => {
  const { data } = await API.post<{ success: boolean; message: string }>(
    "/payment/verify",
    payload
  );
  return data;
};
// RAZORPAY INTEGRATION END
