// app/api/orders/[type]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
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
      return "";
    }
    
    console.error('No user session found and running in production - authentication failed');
    return null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return process.env.NODE_ENV === 'production' ? null : "";
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
    
    if (!orderType || (orderType !== 'sold' && orderType !== 'bought')) {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const orders = await prisma.order.findMany({
      where: {
        [orderType === 'sold' ? 'sellerId' : 'buyerId']: userId,
        ...(status && status !== 'all' ? { status } : {})
      },
      include: {
        service: true,
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        Review: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}