// app/api/orders/[type]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utilities/auth';
import { prisma } from '@/utilities/prisma';
import { Prisma } from '@prisma/client';

// Define proper types that match your Prisma schema
type UserInfo = {
  id: string;
  name: string | null;
  email: string | null;
};

// Define the structure that matches the Prisma query result shapes
type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    seller: { select: { id: true, name: true, email: true } };
    buyer: { select: { id: true, name: true, email: true } };
    Review: true;
    purchasedOrders: {
      include: {
        payment: true;
      }
    };
  }
}>;

// Define the transformed purchased order structure
interface TransformedPurchasedOrder {
  id: string;
  serviceId: string | null;
  workTitle: string | null;
  description: string | null;
  rate: string | null;
  category: string | null;
  createdAt: Date;
  buyerId: string | null;
  sellerId: string | null;
  status: string;
  Review: any[];
  purchaseDate: Date;
  purchasedOrderId: string;
  purchasedOrderStatus: string;
  payment: any[];
  buyer?: UserInfo | null;
  seller?: UserInfo | null;
}

// Get authenticated user ID with better error tracking
async function getUserId() {
  try {
    const session = await getServerSession(authOptions);
    
    // Enhanced logging for debugging session issues
    console.log('Session object:', JSON.stringify({
      exists: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      email: session?.user?.email,
    }, null, 2));
    
    // If we have a user ID in the session, use it directly
    if (session?.user?.id) {
      console.log('Using authenticated user ID from session:', session.user.id);
      return session.user.id;
    }
    
    // If we have an email but no ID, try to fetch the user from the database
    if (session?.user?.email) {
      console.log('Fetching user ID from database using email:', session.user.email);
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      
      if (user?.id) {
        console.log('Found user ID in database:', user.id);
        return user.id;
      }
    }
    
    // Development fallback with clear warning
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ No valid user session found - using fallback ID for development only');
      return "cm67fh38a0000u8tk5v2ii6vt";
    }
    
    console.error('No user session found and running in production - authentication failed');
    return null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return process.env.NODE_ENV === 'production' ? null : "cm67fh38a0000u8tk5v2ii6vt";
  }
}

// Helper function to safely get the dynamic route parameter
function getOrderTypeFromUrl(url: string): string | null {
  try {
    const urlPath = new URL(url).pathname;
    const segments = urlPath.split('/').filter(Boolean);
    // In a path like /api/orders/sold, 'sold' would be at index 2
    return segments.length > 2 ? segments[2] : null;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    // Get user ID with improved error handling
    const userId = await getUserId();
    
    // If no userId and in production, return authentication error
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get order type from URL to avoid the params issue
    const orderType = getOrderTypeFromUrl(request.url);
    console.log(`Order type: ${orderType}, User ID: ${userId}`);
    
    if (!orderType || (orderType !== 'sold' && orderType !== 'bought')) {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    console.log(`Status filter: ${status || 'none'}`);

    // Different query strategies based on order type
    if (orderType === 'sold') {
      // For 'sold' orders, find orders where the current user is the seller
      const whereCondition: Prisma.OrderWhereInput = {
        sellerId: userId,
      };
      
      // Add status filter if provided 
      if (status && status !== 'all') {
        whereCondition.status = status;
      }
      
      console.log('Database query condition for sold orders:', JSON.stringify(whereCondition, null, 2));
      
      const orders = await prisma.order.findMany({
        where: whereCondition,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          Review: true,
          purchasedOrders: {
            include: {
              payment: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log(`Fetched ${orders.length} sold orders for user ${userId}`);
      
      // Log the structure of the first order to debug
      if (orders.length > 0) {
        console.log('First order structure:', JSON.stringify({
          id: orders[0].id,
          hasBuyer: !!orders[0].buyer,
          purchasedOrdersCount: orders[0].purchasedOrders.length,
        }, null, 2));
      }

      // Add buyer information to each purchasedOrder where needed
      const enhancedOrders = await Promise.all(orders.map(async (order) => {
        const enhancedPurchasedOrders = await Promise.all(order.purchasedOrders.map(async (po) => {
          if (po.buyerId) {
            const buyer = await prisma.user.findUnique({
              where: { id: po.buyerId },
              select: {
                id: true,
                name: true,
                email: true,
              }
            });
            
            return {
              ...po,
              buyer: buyer
            };
          }
          return po;
        }));
        
        return {
          ...order,
          purchasedOrders: enhancedPurchasedOrders
        };
      }));

      return NextResponse.json(enhancedOrders);
      
    } else {
      // For 'bought' orders approach: fetch directly from PurchasedOrder
      // where the user is the buyer
      
      // First, check if we need to filter by Order.status
      let orderWhereInput: Prisma.OrderWhereInput | undefined = undefined;
      if (status && status !== 'all') {
        orderWhereInput = {
          status: status,
        };
      }
      
      const purchasedOrders = await prisma.purchasedOrder.findMany({
        where: {
          buyerId: userId,
          // We can't filter PurchasedOrder by Order.status directly,
          // so we'll filter in the include if needed
          order: orderWhereInput,
        },
        include: {
          order: {
            include: {
              seller: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              buyer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              Review: true,
            },
          },
          payment: true,
        },
        orderBy: {
          purchaseDate: 'desc'
        }
      });
      
      console.log(`Fetched ${purchasedOrders.length} purchased orders for user ${userId}`);
      
      // Transform the data to match the expected format in the frontend
      const transformedOrders = purchasedOrders.map(po => {
        if (!po.order) {
          console.error(`Missing order data for purchased order ${po.id}`);
          return null;
        }
        
        // Create a transformed order object that satisfies the TypeScript type
        const transformedOrder: TransformedPurchasedOrder = {
          ...po.order,
          purchaseDate: po.purchaseDate,
          purchasedOrderId: po.id,
          purchasedOrderStatus: po.status,
          payment: po.payment,
          // Use direct inclusion where buyer data might exist
          buyer: po.order.buyer,
          seller: po.order.seller,
          Review: po.order.Review,
        };
        
        return transformedOrder;
      }).filter((order): order is TransformedPurchasedOrder => order !== null);
      
      console.log(`Transformed ${transformedOrders.length} bought orders for user ${userId}`);
      return NextResponse.json(transformedOrders);
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}