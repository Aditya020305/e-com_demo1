import API from "../api/axios";

/* ── Types ── */
export interface RecentOrder {
  _id: string;
  user: { _id: string; name: string; email: string };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  isReturned?: boolean;
  createdAt: string;
  itemCount: number;
}

export interface VendorAnalytics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
}

/* ── API Calls ── */

export const getVendorAnalytics = async (): Promise<VendorAnalytics> => {
  const { data } = await API.get<{
    success: boolean;
    message: string;
    data: VendorAnalytics;
  }>("/vendor/analytics");
  return data.data;
};
