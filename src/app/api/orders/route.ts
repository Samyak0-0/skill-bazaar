// app/api/orders/route.ts
//for the home page stuff(created by sagar hai, this mine).
// for notification aakriti has edited hai, this our .

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utilities/auth';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    const user = await prisma.user.findUnique({  
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        ...(category ? { category } : {}),
        NOT: {
          sellerId: {
            equals: user.id,
          },
        },
      },
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

  // Create a notification for the new order -- added this only 
  await prisma.notification.create({
    data: {
      type: 'New Order',
      message: `You have new order for ${workTitle} (${category}) - ${rate}`,
      userId: sellerId || buyerId || '', // Use sellerId or buyerId
      orderId: order.id,
      read: false
    }
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