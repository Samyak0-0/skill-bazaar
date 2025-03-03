// app/api/orders/[type]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utilities/auth';
import { prisma } from '@/utilities/prisma';

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

    // Build the where condition based on order type
    let whereCondition: any = {};
    
    // This ensures we're looking at the right type of orders (sold by me or bought by me)
    if (orderType === 'sold') {
      whereCondition.sellerId = userId;
      // For sold orders, we want to ensure there's a buyer
      whereCondition.buyerId = { not: null };
    } else {
      whereCondition.buyerId = userId;
      // For bought orders, we want to ensure there's a seller
      whereCondition.sellerId = { not: null };
    }
    
    // Add status filter if provided
    if (status && status !== 'all') {
      whereCondition.status = status;
    }
    
    console.log('Database query condition:', JSON.stringify(whereCondition, null, 2));
    
    // First, check if any orders exist with this seller/buyer ID
    const totalOrdersCount = await prisma.order.count({
      where: {
        [orderType === 'sold' ? 'sellerId' : 'buyerId']: userId,
      }
    });
    
    console.log(`Total ${orderType} orders for user ${userId} (without filters): ${totalOrdersCount}`);
    
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
    console.log(`Fetched ${orders.length} ${orderType} orders for user ${userId}`);
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
      { error: 'Failed to fetch orders', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}