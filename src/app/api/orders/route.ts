// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const orders = await prisma.order.findMany({
      where: category ? {
        category: category
      } : undefined,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workTitle, description, rate, category, serviceId, buyerId, sellerId, status } = body;

    const order = await prisma.order.create({
      data: {
        workTitle,
        description,
        rate,
        category,
        serviceId,
        buyerId,
        sellerId,
        status,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}