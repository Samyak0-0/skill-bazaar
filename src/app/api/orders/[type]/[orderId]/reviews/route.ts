// app/api/orders/[type]/[orderId]/review/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utilities/auth';

// Use a singleton pattern for Prisma to prevent too many connections
import { prisma } from '@/utilities/prisma';

// Helper function to extract type and orderId from the URL path
function getParamsFromUrl(url: string): { type: string | null; orderId: string | null } {
  try {
    const urlPath = new URL(url).pathname;
    const segments = urlPath.split('/').filter(Boolean);
    // In a path like /api/orders/sold/orderId/review, 'type' would be at index 2 and 'orderId' at index 3
    return { 
      type: segments.length > 2 ? segments[2] : null,
      orderId: segments.length > 3 ? segments[3] : null 
    };
  } catch (error) {
    console.error('Error parsing URL:', error);
    return { type: null, orderId: null };
  }
}

// Get authenticated user ID with better error tracking
async function getUserId() {
  try {
    const session = await getServerSession(authOptions);
    
    // Enhanced logging for debugging session issues
    console.log('Session object in review route:', JSON.stringify({
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
      console.warn('⚠️ No valid user session found in review route - using fallback ID for development only');
      return "";
    }
    
    console.error('No user session found in review route and running in production - authentication failed');
    return null;
  } catch (error) {
    console.error('Error getting user session in review route:', error);
    return process.env.NODE_ENV === 'production' ? null : "";
  }
}

export async function GET(request: Request) {
  try {
    const { orderId } = getParamsFromUrl(request.url);
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { orderId },
      include: { 
        reviewer: { 
          select: { name: true } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { type, orderId } = getParamsFromUrl(request.url);
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Only allow reviews from the "bought" type (buyers only)
    if (type !== 'bought') {
      return NextResponse.json(
        { error: 'Only buyers can submit reviews' }, 
        { status: 403 }
      );
    }

    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' }, 
        { status: 401 }
      );
    }

    // Verify the user is actually the buyer for this order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { buyerId: true }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if the current user is the buyer
    if (order.buyerId !== userId) {
      return NextResponse.json(
        { error: 'Only the buyer can submit a review for this order' }, 
        { status: 403 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' }, 
        { status: 400 }
      );
    }

    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        reviewerId: userId,
        orderId
      },
      include: {
        reviewer: {
          select: { name: true }
        }
      },
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create review', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}