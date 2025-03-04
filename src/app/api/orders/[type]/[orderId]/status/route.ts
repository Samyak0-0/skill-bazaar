// app/api/orders/[orderId]/status/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utilities/auth';
import { prisma } from '@/utilities/prisma';

// Get the authenticated user's ID
async function getUserId() {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.id) {
      return session.user.id;
    }
    
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      
      if (user?.id) {
        return user.id;
      }
    }
    
    if (process.env.NODE_ENV !== 'production') {
      return "cm67fh38a0000u8tk5v2ii6vt"; // Development fallback
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
}

// Helper function to get order ID from URL
function getOrderIdFromUrl(url: string): string | null {
  try {
    const urlPath = new URL(url).pathname;
    const segments = urlPath.split('/').filter(Boolean);
    // In a path like /api/orders/123/status, '123' would be at index 2
    return segments.length > 2 ? segments[2] : null;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}

// Validate status transition
function isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  if (currentStatus === 'PENDING' && newStatus === 'IN PROGRESS') return true;
  if (currentStatus === 'IN PROGRESS' && newStatus === 'COMPLETED') return true;
  return false;
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Get authenticated user ID
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get order ID from params instead of URL
    const orderId = params.orderId;
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }
    
    // Parse the request body to get the new status
    const body = await request.json();
    const newStatus = body.status;
    
    if (!newStatus || typeof newStatus !== 'string') {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        sellerId: true,
      }
    });
    
    // Check if order exists
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the seller
    if (order.sellerId !== userId) {
      return NextResponse.json(
        { error: 'Only sellers can update order status' },
        { status: 403 }
      );
    }
    
    // Validate status transition
    if (!isValidStatusTransition(order.status, newStatus)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${order.status} to ${newStatus}` },
        { status: 400 }
      );
    }
    
    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}