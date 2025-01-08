// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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