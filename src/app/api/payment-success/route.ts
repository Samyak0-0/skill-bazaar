// src/app/api/payment-success/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utilities/auth';

//import { PrismaClient } from "@prisma/client";

//const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find the current user
    const buyer = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true }
    });

    if (!buyer) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { itemId, totalPrice } = body;

    // Fetch order details to get seller information
    const order = await prisma.order.findUnique({
      where: { id: itemId },
      select: { 
        sellerId: true, 
        workTitle: true 
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Create notification for the seller
    if (order.sellerId){
    await prisma.notification.create({
      data: {
        type: 'ORDER_PURCHASED',
        message: `${buyer.name || 'A customer'} has purchased your service: ${order.workTitle}`,
        userId: order.sellerId, // Specifically target the seller
        orderId: itemId,
        read: false
      }
    });
  } else {
    console.warn("Order has no sellerId, skipping notification.");
  }

 // Update the order status to PAID
    const updatedOrder = await prisma.order.update({
      where: {
        id: itemId,
      },
      data: {
        status: "PAID",
      },
    });


    return NextResponse.json({ 
      success: true, 
      message: "Payment processed successfully and seller has been notified" 
    });
  } catch (error) {
    console.error("Error processing payment success:", error);
    return NextResponse.json(
      { error: "Failed to process payment success" },
      { status: 500 }
    );
  }
}