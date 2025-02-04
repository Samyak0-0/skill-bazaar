//also by sagar for the orderdetails page , please dont change stuff withohut telling me i will cry..
//D:\skill-bazaar\src\app\api\orderdetails\[id]\route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // params is now a Promise
) {
  try {
    const resolvedParams = await context.params; // Unwrap the Promise

    const order = await prisma.order.findUnique({
      where: {
        id: resolvedParams.id, // Use the unwrapped params
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
