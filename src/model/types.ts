export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  categoryId: number;
  description?: string;
  rating?: number;
  reviewsCount?: number;
  features?: string[];
  inStock?: boolean;
  badge?: string;
}

export interface CartDetail {
  product: Product;
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface OrderCustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'card' | 'spei' | 'oxxo';
}
