// this file is for patch endpoint 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: params.id  
      },
      data: {
        read: true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}