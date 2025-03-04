
//src/app/api/esewa-payment/route.js
import { getEsewaPaymentHash, verifyEsewaPayment } from "@/utilities/esewa";
import { prisma } from "@/utilities/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  //payment completed
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data"); // Data received from eSewa's redirect

  try {
    // Verify payment with eSewa
    const paymentInfo = await verifyEsewaPayment(data);

    // Find the purchased item using the transaction UUID
    const purchasedItemData = await prisma.purchasedOrder.findUnique({
      where: { id: paymentInfo.response.transaction_uuid },
      include: { order: true },
    });

    if (!purchasedItemData) {
      return res.status(500).json({
        success: false,
        message: "Purchase not found",
      });
    }

    const { buyerId } = purchasedItemData;
    const { sellerId } = purchasedItemData.order;

    // Fetch existing contacts
    const buyer = await prisma.user.findUnique({
      where: { id: buyerId },
      select: { contacts: true, name: true},
    });

    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      select: { contacts: true },
    });

    // Merge contacts while ensuring uniqueness
    const updatedBuyerContacts = Array.from(
      new Set([...(buyer?.contacts || []), sellerId])
    );
    const updatedSellerContacts = Array.from(
      new Set([...(seller?.contacts || []), buyerId])
    );

    await prisma.user.update({
      where: { id: buyerId },
      data: {
        contacts: updatedBuyerContacts,
        totalSpending: { increment: paymentInfo.response.total_amount }, // Increment spending
      },
    });
    
    await prisma.user.update({
      where: { id: sellerId },
      data: {
        contacts: updatedSellerContacts,
        totalEarnings: { increment: paymentInfo.response.total_amount }, // Increment earning
      },
    });
    
    // Create a new payment record in the database
    const paymentData = await prisma.payment.create({
      data: {
        transactionId: paymentInfo.decodedData.transaction_code,
        productId: paymentInfo.response.transaction_uuid,
        amount: paymentInfo.response.total_amount,
        dataFromVerificationReq: paymentInfo,
        apiQueryFromUser: req.query,
        paymentGateway: "ESEWA",
        status: "SUCCESS",
      },
    });

    // Update the purchased item status to 'completed'
    await prisma.purchasedOrder.update({
      where: { id: paymentInfo.response.transaction_uuid },
      data: { status: "COMPLETED" },
    });

    //notification - aakriti has added stuffs
    // Fetch the order details

    const orderData = await prisma.order.findUnique({
      where: { id: purchasedItemData.order.id },
      select: { workTitle: true, id: true }
    });

     // Update the order status to PAID
     await prisma.order.update({
      where: { id: purchasedItemData.order.id },
      data: { status: "PAID" },
    });

   // Create a notification for the seller that their product has been purchased
   await prisma.notification.create({
    data: {
      type: "Order Purchased",
      message: `${buyer?.name || "A customer"} has purchased your service "${orderData?.workTitle}". Check your orders for more information.`,
      userId: sellerId,
      orderId: purchasedItemData.order.id,
      read: false
    }
  });
  //sakkyo hai


    // Respond with success message
    return NextResponse.json({
      success: true,
      message: "Payment successful and seller has been notified",
      paymentData,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred during payment verification",
      error: error.message,
    });
  }
}

export async function POST(req, res) {
  //initialize eswea payment
  try {
    const body = await req.json();
    const { itemId, totalPrice, buyerId } = body;

    const itemData = await prisma.order.findUnique({
      where: { id: itemId },
    });

    if (!itemData) {
      return res.status(400).send({
        success: false,
        message: "item not found",
      });
    }
    const purchasedItemData = await prisma.purchasedOrder.create({
      data: {
        orderId: itemId,
        status: "PENDING",
        buyerId: buyerId,
        purchaseDate: new Date(),
      },
    });

    const paymentInitate = await getEsewaPaymentHash({
      amount: totalPrice,
      transaction_uuid: purchasedItemData.id,
    });

    return NextResponse.json({
      success: true,
      payment: paymentInitate,
      purchasedItemData,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
