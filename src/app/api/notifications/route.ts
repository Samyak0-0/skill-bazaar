// src/app/api/notifications/route.ts

// import { NextApiRequest } from 'next/server';
// import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/utilities/auth";
import { authOptions } from "@/utilities/auth"; 
import { prisma } from "@/utilities/prisma"; 

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Sign in to view notifications" },
        { status: 401 }
      );
    } 
    // Find the current user
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
//fetch user specific notification
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id, //only user specific fetched
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50 // Limit to most recent 50 notifications
    });

    return NextResponse.json({ 
      notifications,
      userId: user.id // Include user ID for debugging
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log("Current User ID:", session.user.id);
    // Log all notifications in the system
    const allNotifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("All Notifications:", JSON.stringify(allNotifications, null, 2));
    // Fetch user-specific notifications with more detailed logging
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50
    });

    console.log("User-Specific Notifications:", JSON.stringify(notifications, null, 2));
    
    // Mark all notifications as read
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
      notifications,
      userId: session.user.id,
      allNotificationsCount: allNotifications.length
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

   





// import { NextResponse } from 'next/server';
// //import { PrismaClient } from '@prisma/client';
// import { getAuthSession } from "@/utilities/auth";
// import { prisma } from "@/utilities/prisma";

// //const prisma = new PrismaClient();

// //get all notification for current user
// export async function GET(req: Request) {
//   try {
//     const session = await getAuthSession();
    
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized. Sign in to view notifications" },
//         { status: 401 }
//       );
//     }

//     const notifications = await prisma.notification.findMany({
//       where: {
//         userId: session.user.id,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json({ notifications });
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch notifications" },
//       { status: 500 }
//     );
//   }
// }


