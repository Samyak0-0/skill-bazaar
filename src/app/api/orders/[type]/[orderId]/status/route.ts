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
    console.log('User ID:', userId);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { type, orderId } = params;
    console.log('Route params:', { type, orderId });
    
    if (!orderId || !type || (type !== 'sold' && type !== 'bought')) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }
    
    // Parse the request body to get the new status and purchasedOrderId
    const body = await request.json();
    console.log('Request body:', body);
    
    const { status: newStatus, purchasedOrderId } = body;
    
    if (!newStatus || typeof newStatus !== 'string') {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // IMPROVED: First try with purchasedOrderId, then with orderId, then find by orderId
    const updateId = purchasedOrderId || orderId;
    console.log(`Updating order - Type: ${type}, Order ID: ${orderId}, Update ID: ${updateId}`);
    
    if (type === 'sold') {
      // For sold orders, we should update the specific purchasedOrder
      console.log('Processing sold order update...');
      
      // First check if the purchasedOrder exists
      let purchasedOrder;
      try {
        // Try to find by updateId first
        purchasedOrder = await prisma.purchasedOrder.findUnique({
          where: { id: updateId },
          include: {
            order: {
              select: {
                sellerId: true
              }
            }
          }
        });
        
        // If not found, try to find by orderId
        if (!purchasedOrder) {
          console.log('Purchased order not found by ID, trying to find by orderId...');
          
          purchasedOrder = await prisma.purchasedOrder.findFirst({
            where: { orderId: orderId },
            include: {
              order: {
                select: {
                  sellerId: true
                }
              }
            }
          });
        }
        
        console.log('Purchased order found:', purchasedOrder ? 'yes' : 'no');
        if (purchasedOrder) {
          console.log('Purchased order details:', {
            id: purchasedOrder.id,
            status: purchasedOrder.status,
            sellerId: purchasedOrder.order?.sellerId
          });
        }
      } catch (findError) {
        console.error('Error finding purchased order:', findError);
        return NextResponse.json(
          { 
            error: 'Database error while finding purchased order',
            details: findError instanceof Error ? findError.message : String(findError)
          },
          { status: 500 }
        );
      }
      
      // Check if purchasedOrder exists
      if (!purchasedOrder) {
        console.error('Purchased order not found with ID:', updateId);
        
        // Attempt to find any purchased orders related to the original order
        const relatedPurchasedOrders = await prisma.purchasedOrder.findMany({
          where: {
            orderId: orderId
          },
          select: {
            id: true,
            status: true
          }
        });
        
        console.log('Related purchased orders:', relatedPurchasedOrders);
        
        if (relatedPurchasedOrders.length > 0) {
          return NextResponse.json(
            { 
              error: 'Purchased order not found with the specified ID',
              message: 'However, related purchased orders were found. Please use one of these IDs:',
              relatedPurchasedOrders 
            },
            { status: 404 }
          );
        }
        
        return NextResponse.json(
          { error: 'Purchased order not found' },
          { status: 404 }
        );
      }
      
      // Check if user is the seller
      if (purchasedOrder.order.sellerId !== userId) {
        console.log('Authorization failed. User is not the seller:', {
          userId,
          sellerId: purchasedOrder.order.sellerId
        });
        
        return NextResponse.json(
          { error: 'Only sellers can update this order status' },
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
      
      // Update the purchasedOrder status
      console.log('Updating purchased order status to:', newStatus);
      let updatedPurchasedOrder;
      try {
        updatedPurchasedOrder = await prisma.purchasedOrder.update({
          where: { id: purchasedOrder.id }, // Use the found purchased order ID
          data: { status: newStatus },
          include: {
            order: {
              include: {
                seller: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                buyer: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                }
              }
            },
            payment: true
          }
        });
        
        console.log('Purchased order updated successfully:', {
          id: updatedPurchasedOrder.id,
          newStatus: updatedPurchasedOrder.status
        });
      } catch (updateError) {
        console.error('Failed to update purchased order:', updateError);
        return NextResponse.json(
          { 
            error: 'Database error while updating purchased order',
            details: updateError instanceof Error ? updateError.message : String(updateError)
          },
          { status: 500 }
        );
      }
      
      // Transform the response to match the structure expected by the frontend
      const transformedOrder = {
        ...updatedPurchasedOrder.order,
        purchaseDate: updatedPurchasedOrder.purchaseDate,
        purchasedOrderId: updatedPurchasedOrder.id,
        purchasedOrderStatus: updatedPurchasedOrder.status,
        payment: updatedPurchasedOrder.payment,
        buyer: updatedPurchasedOrder.order.buyer,
        seller: updatedPurchasedOrder.order.seller
      };
      
      return NextResponse.json(transformedOrder);
      
    } else if (type === 'bought') {
      // For bought orders, directly update the purchasedOrder
      console.log('Processing bought order update...');
      
      let purchasedOrder;
      try {
        // Try to find by updateId first
        purchasedOrder = await prisma.purchasedOrder.findUnique({
          where: { id: updateId },
          select: {
            id: true,
            status: true,
            buyerId: true
          }
        });
        
        // If not found, try to find by orderId
        if (!purchasedOrder) {
          console.log('Purchased order not found by ID, trying to find by orderId...');
          
          purchasedOrder = await prisma.purchasedOrder.findFirst({
            where: { orderId: orderId },
            select: {
              id: true,
              status: true,
              buyerId: true
            }
          });
        }
        
        console.log('Purchased order found:', purchasedOrder ? 'yes' : 'no');
        if (purchasedOrder) {
          console.log('Purchased order details:', {
            id: purchasedOrder.id,
            status: purchasedOrder.status,
            buyerId: purchasedOrder.buyerId
          });
        }
      } catch (findError) {
        console.error('Error finding purchased order:', findError);
        return NextResponse.json(
          { 
            error: 'Database error while finding purchased order',
            details: findError instanceof Error ? findError.message : String(findError)
          },
          { status: 500 }
        );
      }
      
      // Check if purchased order exists
      if (!purchasedOrder) {
        console.error('Purchased order not found with ID:', updateId);
        
        // Attempt to find any purchased orders related to the original order
        const relatedPurchasedOrders = await prisma.purchasedOrder.findMany({
          where: {
            orderId: orderId
          },
          select: {
            id: true,
            status: true
          }
        });
        
        console.log('Related purchased orders:', relatedPurchasedOrders);
        
        if (relatedPurchasedOrders.length > 0) {
          return NextResponse.json(
            { 
              error: 'Purchased order not found with the specified ID',
              message: 'However, related purchased orders were found. Please use one of these IDs:',
              relatedPurchasedOrders 
            },
            { status: 404 }
          );
        }
        
        return NextResponse.json(
          { error: 'Purchased order not found' },
          { status: 404 }
        );
      }
      
      // Check if user is the buyer
      if (purchasedOrder.buyerId !== userId) {
        console.log('Authorization failed. User is not the buyer:', {
          userId,
          buyerId: purchasedOrder.buyerId
        });
        
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
      
      // Update the purchasedOrder status
      console.log('Updating purchased order status to:', newStatus);
      let updatedPurchasedOrder;
      try {
        updatedPurchasedOrder = await prisma.purchasedOrder.update({
          where: { id: purchasedOrder.id }, // Use the found purchased order ID
          data: { status: newStatus },
          include: {
            order: {
              include: {
                seller: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                buyer: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                }
              }
            },
            payment: true
          }
        });
        
        console.log('Purchased order updated successfully:', {
          id: updatedPurchasedOrder.id,
          newStatus: updatedPurchasedOrder.status
        });
      } catch (updateError) {
        console.error('Failed to update purchased order:', updateError);
        return NextResponse.json(
          { 
            error: 'Database error while updating purchased order',
            details: updateError instanceof Error ? updateError.message : String(updateError)
          },
          { status: 500 }
        );
      }
      
      // Transform the response to match the structure expected by the frontend
      const transformedOrder = {
        ...updatedPurchasedOrder.order,
        purchaseDate: updatedPurchasedOrder.purchaseDate,
        purchasedOrderId: updatedPurchasedOrder.id,
        purchasedOrderStatus: updatedPurchasedOrder.status,
        payment: updatedPurchasedOrder.payment,
        buyer: updatedPurchasedOrder.order.buyer,
        seller: updatedPurchasedOrder.order.seller
      };
      
      return NextResponse.json(transformedOrder);
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