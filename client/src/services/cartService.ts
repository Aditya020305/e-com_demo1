import API from "../api/axios";

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isActive: boolean;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

export interface CartData {
  _id?: string;
  user: string;
  items: CartItem[];
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: CartData;
}

export const fetchCart = async (): Promise<CartResponse> => {
  const { data } = await API.get<CartResponse>("/cart");
  return data;
};

export const addToCart = async (
  productId: string,
  quantity: number = 1
): Promise<CartResponse> => {
  const { data } = await API.post<CartResponse>("/cart", {
    productId,
    quantity,
  });
  return data;
};

export const updateCartItem = async (
  productId: string,
  quantity: number
): Promise<CartResponse> => {
  const { data } = await API.put<CartResponse>("/cart", {
    productId,
    quantity,
  });
  return data;
};

export const removeCartItem = async (
  productId: string
): Promise<CartResponse> => {
  const { data } = await API.delete<CartResponse>(`/cart/${productId}`);
  return data;
};
