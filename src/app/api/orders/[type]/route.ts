import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/utilities/auth";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    // Retrieve the session using next-auth
    const session = await getServerSession(authOptions);

    // Ensure session and user ID are present
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const type = params.type;  // 'sold' or 'bought'
    const userId = session.user.id; // Access userId from session

    // Validate the 'type' parameter
    if (type !== 'sold' && type !== 'bought') {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      );
    }

    // Fetch orders based on the userId and the order type (sold or bought)
    const orders = await prisma.order.findMany({
      where: {
        ...(type === 'sold' 
          ? { sellerId: userId }
          : { buyerId: userId }
        )
      },
      include: {
        service: true,
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        Review: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
