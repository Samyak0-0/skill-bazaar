import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('API: Attempting to fetch notifications...'); 
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc'
      },
    });
    
    console.log('API: Found notifications:', notifications); 
    
    if (!notifications) {
      return NextResponse.json(
        { error: 'No notifications found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('API: Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}