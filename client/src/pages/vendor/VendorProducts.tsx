import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import VendorLayout from '../../components/vendor/VendorLayout';
import Button from '../../components/ui/Button';
import {
  getVendorProducts,
  deleteProduct,
} from '../../services/productService';
import type { ApiProduct } from '../../services/productService';

/* ── Constants ── */
const FALLBACK_IMAGE = '/products/headphones.png';

/* ========================================
   VendorProducts — Vendor Product Management
   ======================================== */
const VendorProducts: React.FC = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ── Fetch vendor products ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVendorProducts();
      setProducts(data);
    } catch {
      setError('Failed to load your products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ── Delete handler ── */
  const handleDelete = useCallback(
    async (id: string, name: string) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      );
      if (!confirmed) return;

      setDeletingId(id);
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch {
        setError('Failed to delete product. Please try again.');
      } finally {
        setDeletingId(null);
      }
    },
    []
  );

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
            <p className="text-sm text-neutral-500">Loading your products...</p>
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
            My <span className="text-gradient-gold">Products</span>
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {products.length} {products.length === 1 ? 'product' : 'products'} in your catalog
          </p>
        </div>
        <Link to="/vendor/add-product">
          <Button id="add-product-btn" variant="primary" size="md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Button>
        </Link>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 transition-colors"
            aria-label="Dismiss error"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Empty State ── */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-200 mb-2">No products yet</h2>
          <p className="text-sm text-neutral-500 mb-8 max-w-sm mx-auto">
            Start by adding your first product to your catalog. It'll appear here once created.
          </p>
          <Link to="/vendor/add-product">
            <Button variant="primary" size="lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Product
            </Button>
          </Link>
        </div>
      ) : (
        /* ── Product Grid ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isDeleting = deletingId === product._id;
            const image =
              product.images && product.images.length > 0
                ? product.images[0]
                : FALLBACK_IMAGE;

            return (
              <div
                key={product._id}
                className={`
                  bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden
                  group hover:border-neutral-600 transition-all duration-300
                  ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                {/* Product Image */}
                <div className="relative h-48 bg-neutral-900 overflow-hidden">
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`
                        px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${product.isActive
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }
                      `}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-neutral-100 truncate mb-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-primary-400">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Stock: <span className={`font-medium ${product.stock > 0 ? 'text-neutral-300' : 'text-red-400'}`}>
                        {product.stock}
                      </span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/vendor/edit-product/${product._id}`}
                      className="flex-1"
                    >
                      <button
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                                   bg-neutral-700 text-neutral-200 border border-neutral-600
                                   hover:bg-neutral-600 hover:border-neutral-500 hover:text-neutral-100
                                   transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      disabled={isDeleting}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                                 bg-red-500/10 text-red-400 border border-red-500/20
                                 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-200"
                      aria-label={`Delete ${product.name}`}
                    >
                      {isDeleting ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      Delete
                    </button>
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

export default VendorProducts;
