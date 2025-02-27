// First file: review route with enhanced debugging
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utilities/auth';

const prisma = new PrismaClient();

// Temporary function to get user ID with fallback for debugging
async function getUserId() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Authentication session:', JSON.stringify(session, null, 2));
    
    // If we have a valid session with user ID, use it
    if (session?.user?.id) {
      return session.user.id;
    }
    
    // For debugging purposes: fallback to a hardcoded ID
    // IMPORTANT: Remove this in production!
    console.warn('⚠️ Using fallback user ID for development - REMOVE IN PRODUCTION');
    return "cm66ug29w0000v7ls10ac6rga"; // Your original dummy ID
  } catch (error) {
    console.error('Error getting user session:', error);
    // Return null to indicate authentication failed
    return null;
  }
}

export async function GET(
  request: Request, 
  { params }: { params: { type: string; orderId: string } }
) {
  if (!params?.orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { orderId: params.orderId },
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

export async function POST(
  request: Request, 
  { params }: { params: { type: string; orderId: string } }
) {
  if (!params?.orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' }, 
        { status: 401 }
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
        orderId: params.orderId
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