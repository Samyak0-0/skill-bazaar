// app/api/orders/[type]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Replace this with an actual user ID from your database
const DUMMY_USER_ID = "cm66ug29w0000v7ls10ac6rga";

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
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
        [type === 'sold' ? 'sellerId' : 'buyerId']: DUMMY_USER_ID,
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