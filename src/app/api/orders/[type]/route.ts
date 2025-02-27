// app/api/orders/[type]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utilities/auth';

const prisma = new PrismaClient();

// Temporary function to get user ID with fallback for debugging
async function getUserId() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Authentication session in orders route:', JSON.stringify(session, null, 2));
    
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
    // For debugging only, return the dummy ID even on error
    return "cm66ug29w0000v7ls10ac6rga";
  }
}

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    // Get user ID with fallback for debugging
    const userId = await getUserId();
    
    // No authentication check for now (for debugging)
    // We'll use the fallback ID if authentication fails
    
    const type = params.type;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (type !== 'sold' && type !== 'bought') {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        [type === 'sold' ? 'sellerId' : 'buyerId']: userId,
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