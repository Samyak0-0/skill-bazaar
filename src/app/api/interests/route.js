import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userMail = searchParams.get("userMail");

    if (!userMail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { email: userMail },
      select: { interests: true, skills: true, location: true, phone: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      interests: user.interests, 
      skills: user.skills, 
      location: user.location,
      phone: user.phone 
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
