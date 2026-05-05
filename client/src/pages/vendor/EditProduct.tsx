import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import VendorLayout from '../../components/vendor/VendorLayout';
import Button from '../../components/ui/Button';
import { getProductById, updateProduct } from '../../services/productService';

/* ── Types ── */
interface FormState {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  images: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
}

/* ── Validation ── */
const validateForm = (form: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = 'Product name is required';
  else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

  if (!form.description.trim()) errors.description = 'Description is required';
  else if (form.description.trim().length < 10) errors.description = 'Description must be at least 10 characters';

  if (!form.price.trim()) errors.price = 'Price is required';
  else if (isNaN(Number(form.price)) || Number(form.price) < 0) errors.price = 'Price must be a valid non-negative number';

  if (!form.category.trim()) errors.category = 'Category is required';

  if (form.stock.trim() && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) {
    errors.stock = 'Stock must be a valid non-negative number';
  }

  return errors;
};

/* ── Category Options ── */
const CATEGORIES = [
  'Mobile Phones',
  'Laptops',
  'Tablets',
  'Audio',
  'Wearables',
  'Cameras',
  'Gaming',
  'Home Appliances',
  'Kitchen Appliances',
  'Fashion (Men)',
  'Fashion (Women)',
  'Footwear',
  'Accessories',
  'Furniture',
  'Books',
  'Beauty & Personal Care',
  'Sports & Fitness',
  'Office Supplies',
];

/* ── Field Input Component ── */
const FormField: React.FC<{
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ id, label, error, required, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-neutral-300 mb-1.5">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

/* ── Input class builder ── */
const inputClass = (hasError: boolean) =>
  `block w-full rounded-lg border bg-neutral-800/80 backdrop-blur-sm py-3 px-4 text-sm text-neutral-100 placeholder:text-neutral-500
   shadow-inner shadow-black/10 transition-all duration-200 focus:ring-2 focus:outline-none
   ${hasError
    ? 'border-red-500/50 focus:border-red-400 focus:ring-red-400/20'
    : 'border-neutral-600 focus:border-primary-400/60 focus:ring-primary-400/20 hover:border-neutral-500'
  }`;

/* ========================================
   EditProduct — Vendor Edit Product Form
   ======================================== */
const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormState>({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '0',
    images: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const currentErrors = validateForm(form);

  /* ── Fetch existing product data ── */
  useEffect(() => {
    if (!id) {
      setFetchError('Invalid product ID');
      setIsFetching(false);
      return;
    }

    const fetchProduct = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const product = await getProductById(id);
        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          category: product.category,
          stock: String(product.stock),
          images: product.images.join(', '),
        });
      } catch (err: any) {
        const message =
          err?.response?.data?.message || 'Failed to load product. Please try again.';
        setFetchError(message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setApiError(null);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!id) return;

      setSubmitAttempted(true);
      setApiError(null);

      const validationErrors = validateForm(form);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;

      setIsLoading(true);
      try {
        const imageArray = form.images.trim()
          ? form.images.split(',').map((url) => url.trim()).filter(Boolean)
          : [];

        await updateProduct(id, {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          category: form.category,
          stock: Number(form.stock) || 0,
          images: imageArray,
        });

        navigate('/vendor/products');
      } catch (err: any) {
        const message =
          err?.response?.data?.message || 'Failed to update product. Please try again.';
        setApiError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [form, id, navigate],
  );

  const showError = (field: keyof FormErrors) =>
    submitAttempted && currentErrors[field] ? currentErrors[field] : undefined;

  /* ── Loading state ── */
  if (isFetching) {
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
            <p className="text-sm text-neutral-500">Loading product...</p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  /* ── Fetch error state ── */
  if (fetchError) {
    return (
      <VendorLayout>
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-200 mb-2">Failed to Load Product</h2>
          <p className="text-sm text-neutral-500 mb-6">{fetchError}</p>
          <Link to="/vendor/products">
            <Button variant="outline" size="md">
              Back to Products
            </Button>
          </Link>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <Link to="/vendor/products" className="hover:text-primary-400 transition-colors">
            My Products
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-neutral-400">Edit Product</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
          Edit <span className="text-gradient-gold">Product</span>
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Update the product details below.
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl">
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Product Name */}
            <FormField id="edit-name" label="Product Name" error={showError('name')} required>
              <input
                id="edit-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Bluetooth Headphones"
                className={inputClass(!!showError('name'))}
              />
            </FormField>

            {/* Description */}
            <FormField id="edit-description" label="Description" error={showError('description')} required>
              <textarea
                id="edit-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product in detail..."
                rows={4}
                className={inputClass(!!showError('description')) + ' resize-none'}
              />
            </FormField>

            {/* Price & Stock (side-by-side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField id="edit-price" label="Price (₹)" error={showError('price')} required>
                <input
                  id="edit-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={inputClass(!!showError('price'))}
                />
              </FormField>

              <FormField id="edit-stock" label="Stock Quantity" error={showError('stock')}>
                <input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className={inputClass(!!showError('stock'))}
                />
              </FormField>
            </div>

            {/* Category */}
            <FormField id="edit-category" label="Category" error={showError('category')} required>
              <select
                id="edit-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass(!!showError('category')) + ' appearance-none cursor-pointer'}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Image URL */}
            <FormField id="edit-images" label="Image URLs" error={undefined}>
              <input
                id="edit-images"
                name="images"
                type="text"
                value={form.images}
                onChange={handleChange}
                placeholder="Comma-separated URLs (e.g. https://...jpg, https://...png)"
                className={inputClass(false)}
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Separate multiple image URLs with commas.
              </p>
            </FormField>

            {/* API Error */}
            {apiError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {apiError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                id="edit-product-submit"
                type="submit"
                variant="primary"
                size="md"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link to="/vendor/products">
                <Button type="button" variant="outline" size="md">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </VendorLayout>
  );
};

export default EditProduct;
