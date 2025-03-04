// src/app/api/notifications/route.ts

import { NextResponse } from 'next/server';
//import { PrismaClient } from '@prisma/client';
import { getAuthSession } from "@/utilities/auth";
import { prisma } from "@/utilities/prisma";

//const prisma = new PrismaClient();

//get all notification for current user
export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Sign in to view notifications" },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
// Mark all notifications as read
export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Mark all notifications as read for the current user
    const result = await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `${result.count} notifications marked as read` 
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}


// // Create a new notification
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { type, message, userId, orderId, read = false } = body;

//     if (!type || !message || !userId) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const notification = await prisma.notification.create({
//       data: {
//         type,
//         message,
//         userId,
//         orderId,
//         read,
//       },
//     });

//     return NextResponse.json(notification, { status: 201 });
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     return NextResponse.json(
//       { error: "Failed to create notification" },
//       { status: 500 }
//     );
//   }
// }



