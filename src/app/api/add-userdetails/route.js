// app/api/update-profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

export async function POST(req) {
  try {
    const { userMail, location, phone } = await req.json();

    if (!userMail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    // Update user in the database
    const updatedUser = await prisma.user.update({
      where: { email: userMail },
      data: {
        location: location,
        phone: phone, // Since phone is an array in the schema
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}