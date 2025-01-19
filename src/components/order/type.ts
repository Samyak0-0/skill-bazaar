// components/order/types.ts
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
}

export interface OrderCardProps {
  username: string;
  skill: string;
  work: string;
  status: string;
  date: string;
  reviews: number;
}