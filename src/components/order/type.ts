// type.ts - Comprehensive type definitions aligned with Prisma schema

// Basic user information
export interface UserInfo {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Define the Review type
export interface Review {
  id: string;
  orderId: string;
  reviewerId: string;
  reviewer: {
    id: string;
    name: string | null;
    email?: string | null;
  };
  rating: number;
  comment: string;
  createdAt: Date;
  purchasedOrderid?: string;
}

// Define the Order type
export interface Order {
  id: string;
  status: string;
  sellerId?: string;
  buyerId?: string;
  workTitle?: string | null;
  description?: string | null;
  rate?: string | null;
  category?: string | null;
  createdAt: Date;
  updatedAt?: Date;
  serviceId?: string;
  Review?: Review[];
  seller?: UserInfo;
  buyer?: UserInfo;
  purchasedOrders?: PurchasedOrder[];
}

// Define the PurchasedOrder type
export interface PurchasedOrder {
  id: string;
  orderId: string;
  buyerId?: string;
  status: string;
  purchaseDate: Date | string;
  buyer?: UserInfo;
}

// User interface
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  phone?: string | null;
  skills?: string[] | null;
  interests?: string[] | null;
  location?: string | null;
  contacts?: string[] | null;
  totalSpending?: number;
  totalEarnings?: number;
}

// Service interface
export interface Service {
  id: string;
  name: string;
  rate: number;
  sellerId: string;
  seller?: User;
  orders?: Order[];
}

// Define the order type literal
export type OrderType = 'bought' | 'sold';

// Props interfaces for components
export interface OrderCardProps {
  username: string;
  category: string;
  work: string;
  status: string;
  date: string;
  reviews: number;
  orderId: string;
  type?: OrderType;
  isPurchased?: boolean;
  purchasedOrderId?: string;
}