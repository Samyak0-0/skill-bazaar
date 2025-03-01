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

    // Filter out orders with null serviceId
    const orders = await prisma.order.findMany({
      where: {
        ...(category ? { category } : {}),
        NOT: {
          sellerId: {
            equals: user.id,
          },
        },
        serviceId: {
          not: null
        }
      },
      include: {
        Review: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Calculate average rating for each order and add it to the order object
    const ordersWithRating = orders.map(order => {
      const reviews = order.Review || [];
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      return {
        ...order,
        averageRating: parseFloat(averageRating.toFixed(1))
      };
    });
    
    // Sort orders by rating (highest first)
    ordersWithRating.sort((a, b) => b.averageRating - a.averageRating);
    
    return NextResponse.json(ordersWithRating);
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

    // Create a notification for the new order
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
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

//api route below works well until the ratiing stuff , change if needed ahhh
// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import { getServerSession } from "next-auth";
// import { authOptions } from '@/utilities/auth';

// const prisma = new PrismaClient();

// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(req.url);
//     const category = searchParams.get('category');
    
//     const user = await prisma.user.findUnique({  
//       where: { email: session.user.email },
//       select: { id: true }
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Filter out orders with null serviceId
//     const orders = await prisma.order.findMany({
//       where: {
//         ...(category ? { category } : {}),
//         NOT: {
//           sellerId: {
//             equals: user.id,
//           },
//         },
//         serviceId: {
//           not: null
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });
    
//     return NextResponse.json(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch orders' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { workTitle, description, rate, category, serviceId, buyerId, sellerId, status } = body;

//     const order = await prisma.order.create({
//       data: {
//         workTitle,
//         description,
//         rate,
//         category,
//         serviceId,
//         buyerId,
//         sellerId,
//         status,
//       },
//     });

//     // Create a notification for the new order
//     await prisma.notification.create({
//       data: {
//         type: 'New Order',
//         message: `You have new order for ${workTitle} (${category}) - ${rate}`,
//         userId: sellerId || buyerId || '', // Use sellerId or buyerId
//         orderId: order.id,
//         read: false
//       }
//     });

//     return NextResponse.json(order, { status: 201 });
//   } catch (error) {
//     console.error('Order creation error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch orders' },
//       { status: 500 }
//     );
//   }
// }