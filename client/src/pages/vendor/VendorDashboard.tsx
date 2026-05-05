import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import VendorLayout from '../../components/vendor/VendorLayout';
import { useAuth } from '../../hooks/useAuth';
import { getVendorAnalytics } from '../../services/vendorService';
import type { VendorAnalytics, RecentOrder } from '../../services/vendorService';

/* ── Helpers ── */
const formatCurrency = (amount: number): string =>
  `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/* ── Stat Card Component ── */
interface StatCardProps {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  bgGlow: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon,
  accentColor,
  bgGlow,
  loading,
}) => (
  <div
    id={id}
    className="relative bg-neutral-800 border border-neutral-700 rounded-xl p-6 overflow-hidden group hover:border-neutral-600 transition-all duration-300"
  >
    {/* Background Glow */}
    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${bgGlow}`} />

    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-neutral-400">{title}</p>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentColor}`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      {loading ? (
        <div className="h-9 w-24 bg-neutral-700 rounded-lg animate-pulse" />
      ) : (
        <p className="text-3xl font-bold text-neutral-100 tracking-tight">{value}</p>
      )}

      {/* Subtitle */}
      <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>
    </div>
  </div>
);

/* ── Recent Order Row ── */
const OrderRow: React.FC<{ order: RecentOrder }> = ({ order }) => {
  const customerName =
    typeof order.user === 'object' ? order.user.name : 'Customer';

  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-neutral-900/50 transition-colors duration-150">
      {/* Customer avatar placeholder */}
      <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-neutral-400 uppercase">
          {customerName.charAt(0)}
        </span>
      </div>

      {/* Order info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-200 truncate">{customerName}</p>
        <p className="text-[11px] text-neutral-500">
          {formatDate(order.createdAt)} · {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Amount */}
      <span className="text-sm font-semibold text-primary-400">
        {formatCurrency(order.totalPrice)}
      </span>

      {/* Status */}
      <span
        className={`
          hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider
          ${order.isDelivered
            ? 'bg-green-500/15 text-green-400 border border-green-500/20'
            : order.isPaid
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
              : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
          }
        `}
      >
        {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
      </span>
    </div>
  );
};

/* ========================================
   VendorDashboard — Main Dashboard Page
   ======================================== */
const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVendorAnalytics();
      setAnalytics(data);
    } catch {
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <VendorLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
          Vendor <span className="text-gradient-gold">Dashboard</span>
        </h1>
        <p className="mt-2 text-neutral-500 text-sm">
          Welcome back, <span className="text-primary-400 font-medium">{user?.name || 'Vendor'}</span>. Here's an overview of your store.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="flex-1">{error}</span>
          <button onClick={fetchAnalytics} className="text-red-400 hover:text-red-300 text-xs font-medium underline underline-offset-2">
            Retry
          </button>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div id="layout-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          id="stat-total-products"
          title="Total Products"
          value={analytics ? String(analytics.totalProducts) : '0'}
          subtitle="Active listings"
          accentColor="bg-primary-500/15 text-primary-400"
          bgGlow="bg-primary-500/10"
          loading={loading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />

        <StatCard
          id="stat-total-orders"
          title="Total Orders"
          value={analytics ? String(analytics.totalOrders) : '0'}
          subtitle="Lifetime orders"
          accentColor="bg-blue-500/15 text-blue-400"
          bgGlow="bg-blue-500/10"
          loading={loading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
        />

        <StatCard
          id="stat-revenue"
          title="Revenue"
          value={analytics ? formatCurrency(analytics.totalRevenue) : '₹0.00'}
          subtitle="Total earnings"
          accentColor="bg-green-500/15 text-green-400"
          bgGlow="bg-green-500/10"
          loading={loading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Two-Column Layout: Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Orders — takes 3 cols */}
        <div className="lg:col-span-3 bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-100">Recent Orders</h2>
            <Link
              to="/vendor/orders"
              className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="p-2">
            {loading ? (
              /* Skeleton */
              <div className="space-y-2 p-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-700 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-28 bg-neutral-700 rounded animate-pulse" />
                      <div className="h-2.5 w-40 bg-neutral-700/60 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-16 bg-neutral-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : analytics && analytics.recentOrders.length > 0 ? (
              <div className="divide-y divide-neutral-700/50">
                {analytics.recentOrders.map((order) => (
                  <OrderRow key={order._id} order={order} />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-neutral-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-neutral-500">No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions — takes 2 cols */}
        <div className="lg:col-span-2 bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-100">Quick Actions</h2>
          </div>
          <div className="p-3 space-y-2">
            {[
              {
                label: 'Add New Product',
                to: '/vendor/add-product',
                desc: 'List a new item in your store',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                ),
              },
              {
                label: 'View Products',
                to: '/vendor/products',
                desc: 'Manage your product catalog',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                ),
              },
              {
                label: 'View Orders',
                to: '/vendor/orders',
                desc: 'Track and manage orders',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
              },
              {
                label: 'Visit Store',
                to: '/',
                desc: 'See your products live',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                  </svg>
                ),
              },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-neutral-700 text-sm font-medium text-neutral-300 hover:text-primary-400 hover:border-primary-500/30 hover:bg-primary-500/5 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-700/50 flex items-center justify-center text-neutral-500 group-hover:text-primary-400 transition-colors">
                  {action.icon}
                </div>
                <div>
                  <p className="font-medium">{action.label}</p>
                  <p className="text-[11px] text-neutral-500 font-normal">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;
