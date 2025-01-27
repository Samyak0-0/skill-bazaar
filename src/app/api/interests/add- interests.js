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

    // Fetch the current user's interests
    const user = await prisma.user.findUnique({
      where: { email: userMail },
      select: { interests: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User  not found" },
        { status: 404 }
      );
    }

    // Update the user's interests in the database
    await prisma.user.update({
      where: { email: userMail },
      data: {
        interests: {
          set: [...user.interests, interest], // Combine existing interests with the new one
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