// app/api/orders/[type]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// You can hardcode these IDs after running the seed
const TEST_SELLER_ID = "cm5tvg7dm0001v7ikzimffkob";
const TEST_BUYER_ID = "cm5tvg6uv0000v7ikgur27dqm";

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const type = params.type;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Use the appropriate test ID based on the type of orders requested
    const testUserId = type === 'sold' ? TEST_SELLER_ID : TEST_BUYER_ID;

    if (type !== 'sold' && type !== 'bought') {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        [type === 'sold' ? 'sellerId' : 'buyerId']: testUserId,
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
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}