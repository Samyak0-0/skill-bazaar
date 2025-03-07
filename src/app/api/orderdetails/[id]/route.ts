//also by sagar for the orderdetails page , please dont change stuff withohut telling me i will cry..
//D:\skill-bazaar\src\app\api\orderdetails\[id]\route.ts

// @ts-nocheck

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//aakriti has added Patch method only dont cry 
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    const updatedOrder = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        status: status,
      },
    });
    if (updatedOrder.buyerId) {

    // Create a notification for the buyer
    await prisma.notification.create({
      data: {
        type: `Order ${status}`,
        message: `Your order "${updatedOrder.workTitle}" has been ${status.toLowerCase()}`,
        userId: updatedOrder.buyerId,
        orderId: updatedOrder.id,
        read: false
      }
    });
    
  }
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;

    const order = await prisma.order.findUnique({
      where: {
        id: resolvedParams.id,
      },
      include: {
        Review: {
          include: {
            reviewer: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        buyer: {
          select: {
            name: true,
            image: true,
          },
        },
        seller: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Calculate average rating
    const averageRating = order.Review.length > 0
      ? (order.Review.reduce((sum, review) => sum + review.rating, 0) / order.Review.length).toFixed(1)
      : "No ratings yet";

    return NextResponse.json({
      ...order,
      averageRating,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}





// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ id: string }> } // params is now a Promise
// ) {
//   try {
//     const resolvedParams = await context.params; // Unwrap the Promise

//     const order = await prisma.order.findUnique({
//       where: {
//         id: resolvedParams.id, // Use the unwrapped params
//       },
//     });

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json(order);
//   } catch (error) {
//     console.error("Error fetching order details:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch order details" },
//       { status: 500 }
//     );
//   }
// }
