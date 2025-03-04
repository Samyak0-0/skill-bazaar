// src/app/api/payment-success/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

//import { PrismaClient } from "@prisma/client";

//const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      console.error("Missing orderId in request");
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    console.log(`Processing payment success for order: ${orderId}`);

    // Get the order details
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update the order status to PAID
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "PAID",
      },
    });

    // Create a notification for the seller
    if (order.sellerId) {
      const buyerName = order.buyer?.name || "A customer";
      
      const notification = await prisma.notification.create({
        data: {
          type: "Order Purchased",
          message: `${buyerName} has purchased your service "${order.workTitle}". Check the order details for more information.`,
          userId: order.sellerId,
          orderId: order.id,
          read: false
        }
      });
      
      console.log(`Created notification for seller ${order.sellerId}: ${notification.id}`);
    }

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