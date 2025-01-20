// components/order/type.ts
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
  serviceId: string;  // Added this as it's required in your Prisma schema
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

export interface OrderCardProps {
  username: string;
  skill: string;
  work: string;
  status: string;
  date: string;
  reviews: number;
}