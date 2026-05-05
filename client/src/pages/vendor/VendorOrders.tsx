import React, { useState, useEffect, useCallback } from 'react';
import VendorLayout from '../../components/vendor/VendorLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { getVendorOrders } from '../../services/orderService';
import type { VendorOrder, VendorOrderItem } from '../../services/orderService';

/* ── Helpers ── */
const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (amount: number): string =>
  `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ── Status Badge Component ── */
const StatusBadge: React.FC<{
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  activeColor: string;
  inactiveColor: string;
}> = ({ active, activeLabel, inactiveLabel, activeColor, inactiveColor }) => (
  <span
    className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider
      ${active ? activeColor : inactiveColor}
    `}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-current' : 'bg-current opacity-50'}`} />
    {active ? activeLabel : inactiveLabel}
  </span>
);

/* ========================================
   VendorOrders — Vendor Order Management
   ======================================== */
const VendorOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  /* ── Fetch vendor orders ── */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVendorOrders();
      setOrders(data);
    } catch {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ── Filter to show only this vendor's items in each order ── */
  const getVendorItems = useCallback(
    (items: VendorOrderItem[]): VendorOrderItem[] => {
      if (!user) return items;
      return items.filter(
        (item) =>
          item.product &&
          typeof item.product === 'object' &&
          item.product.vendor === user.id
      );
    },
    [user],
  );

  /* ── Calculate vendor revenue from an order ── */
  const getVendorTotal = useCallback(
    (items: VendorOrderItem[]): number => {
      const vendorItems = getVendorItems(items);
      return vendorItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    [getVendorItems],
  );

  /* ── Toggle order detail expansion ── */
  const toggleExpand = useCallback((orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  }, []);

  /* ── Loading state ── */
  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-8 w-8 text-primary-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-neutral-500">Loading orders...</p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            Vendor <span className="text-gradient-gold">Orders</span>
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} containing your products
          </p>
        </div>
        {error && (
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            Retry
          </Button>
        )}
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Empty State ── */}
      {orders.length === 0 && !error ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-200 mb-2">No orders yet</h2>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            Orders containing your products will appear here once customers start purchasing.
          </p>
        </div>
      ) : (
        /* ── Orders List ── */
        <div className="space-y-4">
          {orders.map((order) => {
            const vendorItems = getVendorItems(order.orderItems);
            const vendorTotal = getVendorTotal(order.orderItems);
            const isExpanded = expandedOrder === order._id;
            const customerName =
              typeof order.user === 'object' ? order.user.name : 'Customer';
            const customerEmail =
              typeof order.user === 'object' ? order.user.email : '';

            return (
              <div
                key={order._id}
                className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden hover:border-neutral-600 transition-all duration-200"
              >
                {/* ── Order Header (clickable) ── */}
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-neutral-750 transition-colors duration-200"
                >
                  {/* Order ID & Date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-neutral-200">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5 truncate">
                      {customerName}
                      {customerEmail && (
                        <span className="text-neutral-600"> · {customerEmail}</span>
                      )}
                    </p>
                  </div>

                  {/* Items count */}
                  <div className="hidden sm:flex flex-col items-center px-3">
                    <span className="text-xs text-neutral-500">Items</span>
                    <span className="text-sm font-semibold text-neutral-200">
                      {vendorItems.length}
                    </span>
                  </div>

                  {/* Revenue */}
                  <div className="flex flex-col items-end px-3">
                    <span className="text-xs text-neutral-500">Your Revenue</span>
                    <span className="text-sm font-bold text-primary-400">
                      {formatCurrency(vendorTotal)}
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div className="hidden md:flex items-center gap-2">
                    <StatusBadge
                      active={order.isPaid}
                      activeLabel="Paid"
                      inactiveLabel="Unpaid"
                      activeColor="bg-green-500/15 text-green-400 border border-green-500/20"
                      inactiveColor="bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                    />
                    <StatusBadge
                      active={order.isDelivered}
                      activeLabel="Delivered"
                      inactiveLabel="Pending"
                      activeColor="bg-blue-500/15 text-blue-400 border border-blue-500/20"
                      inactiveColor="bg-neutral-500/15 text-neutral-400 border border-neutral-500/20"
                    />
                    {order.isReturned && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        Returned
                      </span>
                    )}
                  </div>

                  {/* Expand Arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-neutral-500 transition-transform duration-200 flex-shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Mobile status badges (below header) */}
                <div className="md:hidden px-5 pb-3 flex flex-wrap gap-2">
                  <StatusBadge
                    active={order.isPaid}
                    activeLabel="Paid"
                    inactiveLabel="Unpaid"
                    activeColor="bg-green-500/15 text-green-400 border border-green-500/20"
                    inactiveColor="bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                  />
                  <StatusBadge
                    active={order.isDelivered}
                    activeLabel="Delivered"
                    inactiveLabel="Pending"
                    activeColor="bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    inactiveColor="bg-neutral-500/15 text-neutral-400 border border-neutral-500/20"
                  />
                  {order.isReturned && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      Returned
                    </span>
                  )}
                </div>

                {/* ── Expanded Detail ── */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-neutral-700 px-5 py-4 space-y-4">
                    {/* Vendor's Items */}
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                        Your Products in this Order
                      </h4>
                      <div className="space-y-2">
                        {vendorItems.map((item, idx) => (
                          <div
                            key={`${order._id}-item-${idx}`}
                            className="flex items-center gap-3 bg-neutral-900/50 rounded-lg p-3"
                          >
                            {/* Product image */}
                            <div className="w-10 h-10 rounded-lg bg-neutral-700 overflow-hidden flex-shrink-0">
                              {item.product?.images?.[0] ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Product info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral-200 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {formatCurrency(item.price)} × {item.quantity}
                              </p>
                            </div>

                            {/* Item total */}
                            <span className="text-sm font-semibold text-neutral-200">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-neutral-900/50 rounded-lg p-3">
                        <h5 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                          Shipping
                        </h5>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                      <div className="bg-neutral-900/50 rounded-lg p-3">
                        <h5 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                          Payment
                        </h5>
                        <p className="text-xs text-neutral-300">{order.paymentMethod}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Order Total: {formatCurrency(order.totalPrice)}
                        </p>
                      </div>
                      <div className="bg-neutral-900/50 rounded-lg p-3">
                        <h5 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                          Your Revenue
                        </h5>
                        <p className="text-lg font-bold text-primary-400">
                          {formatCurrency(vendorTotal)}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          from {vendorItems.length} {vendorItems.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </VendorLayout>
  );
};

export default VendorOrders;
