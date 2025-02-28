// app/api/orders/[type]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utilities/auth';

const prisma = new PrismaClient();

// Get authenticated user ID more reliably
async function getUserId() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Authentication session in orders route:', JSON.stringify(session, null, 2));
    
    // If we have a valid session with user ID, use it
    if (session?.user?.id) {
      return session.user.id;
    }
    
    // Development fallback with clear warning
    console.warn('⚠️ No valid user session found - using fallback ID for development only');
    return process.env.NODE_ENV === 'production' 
      ? null 
      : "cm67b0urn0000v7uky5xp4a7s";
  } catch (error) {
    console.error('Error getting user session:', error);
    return process.env.NODE_ENV === 'production' ? null : "cm67b0urn0000v7uky5xp4a7s";
  }
}

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
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