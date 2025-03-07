import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userMail = searchParams.get("userMail");
    const userId = searchParams.get("userId");

    if (!userMail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { email: userMail },
      select: {
        interests: true,
        skills: true,
        location: true,
        phone: true,
        totalSpending: true,
        totalEarnings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalCompletedOrders = await prisma.purchasedOrder.count({
      where: {
        status: "COMPLETED",
        order: {
          sellerId: userId,
        },
      },
    });

    const serviceList = await prisma.order.findMany({
      where: {
        sellerId: userId,
      },
    });

    return NextResponse.json({
      interests: user.interests,
      skills: user.skills,
      location: user.location,
      phone: user.phone,
      totalEarnings: user.totalEarnings,
      totalSpending: user.totalSpending,
      completedOrders: totalCompletedOrders,
      serviceList: serviceList,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");

    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    // Delete the order from the database
    const deletedService = await prisma.order.delete({
      where: {
        id: serviceId,
      },
    });

    if (!deletedService) {
      return NextResponse.json(
        { error: "Service not found or could not be deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Service deleted successfully", deletedService },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
