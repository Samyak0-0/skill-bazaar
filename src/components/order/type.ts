// type.ts - Complete corrected type definitions

// Import the original User type from Prisma
import { User as PrismaUser } from "@prisma/client";

// Basic user information
export interface UserInfo {
  id: string;
  name?: string | null;
  email?: string | null;
}

// Define the Order type
export interface Order {
  id: string;
  status: string;
  sellerId: string;
  workTitle?: string | null;
  description?: string | null;
  rate?: string | null;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
  Review?: Array<Review>;
  seller?: UserInfo;
  // Make purchasedOrders optional to match how it's used
  purchasedOrders?: Array<PurchasedOrder>;
  // Add buyer field that was missing
  buyer?: UserInfo;
}

// Define the PurchasedOrder type
export interface PurchasedOrder {
  id: string;
  orderId: string;
  buyerId: string;
  status: string;
  purchaseDate: Date | string;
  // Include buyer to match your usage
  buyer?: UserInfo;
  // Include payment to match your usage
  payment?: Array<Payment>;
}

// Define the Review type
export interface Review {
  id: string;
  orderId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
}

// Define the Payment type
export interface Payment {
  id: string;
  purchasedOrderId: string;
  amount: number;
  status: string;
  createdAt: Date;
}

// Instead of extending PrismaUser which might have incompatible properties,
// define a new User interface that matches your needs
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  phone?: string | null;
  skills?: string[] | null;
  interests?: string[] | null;
}