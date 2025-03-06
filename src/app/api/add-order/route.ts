// app/api/seller-orders/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utilities/auth';
import { prisma } from '@/utilities/prisma';

// Define the Order interface
interface Order {
  id: string;
  title?: string;
  price?: number;
  status: 'pending' | 'in_progress' | 'active' | 'completed' | 'cancelled';
  buyerId?: string;
  sellerId?: string;
  buyer?: {
    id: string;
    name: string;
    email: string;
  };
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  Review?: any[];
  createdAt: Date;
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

export async function GET(req: Request) {
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
    
    const { searchParams } = new URL(req.url); // Fixed 'request' to 'req'
    const status = searchParams.get('status');
    console.log(`Status filter: ${status || 'none'}`);

    // Build the where condition for seller orders only
    let whereCondition: any = {
      sellerId: userId,
      // For sold orders, we want to ensure there's a buyer
      buyerId: { not: null }
    };
    
    // Add status filter if provided
    if (status && status !== 'all') {
      whereCondition.status = status;
    }
    
    console.log('Database query condition:', JSON.stringify(whereCondition, null, 2));
    
    // First, check if any orders exist with this seller ID
    const totalOrdersCount = await prisma.order.count({
      where: {
        sellerId: userId,
      }
    });
    
    console.log(`Total seller orders for user ${userId} (without filters): ${totalOrdersCount}`);
    
    // Now perform the actual query with all filters
    const orders = await prisma.order.findMany({
      where: whereCondition,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true, // Include email for better debugging
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true, // Include email for better debugging
          },
        },
        Review: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Log the count and first item for debugging
    console.log(`Fetched ${orders.length} seller orders for user ${userId}`);
    if (orders.length > 0) {
      console.log('First order sample:', JSON.stringify({
        id: orders[0].id,
        buyerId: orders[0].buyerId,
        sellerId: orders[0].sellerId,
        buyerName: orders[0].buyer?.name,
        sellerName: orders[0].seller?.name,
      }, null, 2));
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seller orders', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}