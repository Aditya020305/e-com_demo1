import API from "../api/axios";

export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  vendor: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: ApiProduct[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export const getProducts = async (
  keyword?: string,
  category?: string,
  page?: number,
  limit?: number
): Promise<ProductsResponse> => {
  const params: Record<string, string | number> = {};
  if (keyword) params.keyword = keyword;
  if (category) params.category = category;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const { data } = await API.get<ProductsResponse>("/products", { params });
  return data;
};

export const getProductById = async (id: string): Promise<ApiProduct> => {
  const { data } = await API.get<{ success: boolean; data: ApiProduct }>(
    `/products/${id}`
  );
  return data.data;
};
