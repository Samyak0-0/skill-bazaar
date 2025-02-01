// pages/api/add-interest.js
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

export async function POST(req) {
  try {
    const { userMail, interest } = await req.json();

    if (!userMail || !interest) {
      return NextResponse.json(
        { error: "User  email and interest are required" },
        { status: 400 }
      );
    }

    // Update the user's interests in the database
    await prisma.user.update({
      where: { email: userMail },
      data: {
        interests: {
          push: interest, // Use push to add the new interest
        },
      },
    });

    return NextResponse.json({ message: "Interest added successfully" });
  } catch (error) {
    console.error("Error adding interest:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}