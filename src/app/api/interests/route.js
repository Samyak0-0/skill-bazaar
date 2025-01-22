
// Import required modules
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

export async function GET(req) {
  try {
    
    const { searchParams } = new URL(req.url);
    const userMail = searchParams.get("userMail");

    if (!userMail) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the user's interests from the database
    const user = await prisma.user.findUnique({
      where: { email: userMail },
      select: { interests: true, skills: true },
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



  
