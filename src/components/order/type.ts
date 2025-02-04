// types/order.ts
export interface Order {
  id: string;
  workTitle: string | null;
  description: string | null;
  rate: string | null;
  category: string | null;
  createdAt: string;
  buyerId: string | null;
  sellerId: string | null;
  status: string;
  serviceId: string;
  service?: {
    id: string;
    name: string;
  };
  buyer?: {
    id: string;
    name: string;
  };
  seller?: {
    id: string;
    name: string;
  };
  Review?: Array<{
    id: string;
    rating: number;
    comment: string;
  }>;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    name: string;
  };
}

export interface OrderCardProps {
  username: string;
  skill: string;
  work: string;
  status: string;
  date: string;
  reviews: number;
  orderId: string; // Add this new prop
}