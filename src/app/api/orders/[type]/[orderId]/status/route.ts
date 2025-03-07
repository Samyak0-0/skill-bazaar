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

// Validate status transition
function isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  if (currentStatus === 'PENDING' && newStatus === 'IN PROGRESS') return true;
  if (currentStatus === 'IN PROGRESS' && newStatus === 'COMPLETED') return true;
  return false;
}

export async function PATCH(
  request: Request,
  { params }: { params: { type: string; orderId: string } }
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
    
    const { type, orderId } = params;
    
    if (!orderId || !type || (type !== 'sold' && type !== 'bought')) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
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
    
    if (type === 'sold') {
      // For sold orders, we need to find the purchasedOrder associated with this order
      // and this seller
      
      // First find the related purchasedOrder through the orderId
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          sellerId: true,
          purchasedOrders: {
            select: {
              id: true,
              status: true,
              buyerId: true
            }
          }
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
      
      // Check if there are any purchasedOrders
      if (!order.purchasedOrders || order.purchasedOrders.length === 0) {
        return NextResponse.json(
          { error: 'No purchased orders found for this order' },
          { status: 404 }
        );
      }
      
      // Get the purchasedOrder (assume there is only one for this example)
      // If there are multiple, you might need additional logic to determine which one to update
      const purchasedOrder = order.purchasedOrders[0];
      
      // Validate status transition
      if (!isValidStatusTransition(purchasedOrder.status, newStatus)) {
        return NextResponse.json(
          { error: `Invalid status transition from ${purchasedOrder.status} to ${newStatus}` },
          { status: 400 }
        );
      }
      
      // Update ONLY the purchasedOrder status
      const updatedPurchasedOrder = await prisma.purchasedOrder.update({
        where: { id: purchasedOrder.id },
        data: { status: newStatus }
      });
      
      return NextResponse.json(updatedPurchasedOrder);
      
    } else if (type === 'bought') {
      // For bought orders, the orderId param is the purchasedOrder ID
      const purchasedOrder = await prisma.purchasedOrder.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          status: true,
          buyerId: true
        }
      });
      
      // Check if purchased order exists
      if (!purchasedOrder) {
        return NextResponse.json(
          { error: 'Purchased order not found' },
          { status: 404 }
        );
      }
      
      // Check if user is the buyer
      if (purchasedOrder.buyerId !== userId) {
        return NextResponse.json(
          { error: 'Only buyers can update this order status' },
          { status: 403 }
        );
      }
      
      // Validate status transition
      if (!isValidStatusTransition(purchasedOrder.status, newStatus)) {
        return NextResponse.json(
          { error: `Invalid status transition from ${purchasedOrder.status} to ${newStatus}` },
          { status: 400 }
        );
      }
      
      // Update ONLY the purchasedOrder status
      const updatedPurchasedOrder = await prisma.purchasedOrder.update({
        where: { id: orderId },
        data: { status: newStatus }
      });
      
      return NextResponse.json(updatedPurchasedOrder);
    }
    
    // If we get here, something went wrong with the type
    return NextResponse.json(
      { error: 'Invalid order type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}