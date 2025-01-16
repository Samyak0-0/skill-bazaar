
// Import required modules
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

export async function GET(req) {
  try {
    // Extract userId from the query parameters (you can modify this based on how the ID is passed)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the user's interests from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { interests: true,skills: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return the interests
    return NextResponse.json({ interests: user.interests, skills: user.skills });
  } catch (error) {
    console.error("Error fetching interests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



  
