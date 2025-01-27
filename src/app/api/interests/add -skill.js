// pages/api/add-skill.js
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

export async function POST(req) {
  try {
    const { userMail, skill } = await req.json();

    if (!userMail || !skill) {
      return NextResponse.json(
        { error: "User  email and skill are required" },
        { status: 400 }
      );
    }

    // Update the user's skills in the database
    await prisma.user.update({
      where: { email: userMail },
      data: {
        skills: {
          push: skill, // Assuming skills is an array
        },
      },
    });

    return NextResponse.json({ message: "Skill added successfully" });
  } catch (error) {
    console.error("Error adding skill:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}