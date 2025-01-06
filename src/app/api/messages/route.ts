import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

// Handle POST requests (if applicable)
export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log(data);
  const { senderId, recipientId, text, timestamp } = data;

  try {
    // Create a new message in the database using Prisma
    const newMessage = await prisma.messages.create({
      data: {
        senderId,
        recipientId,
        text,
        timestamp,
      },
    });

    // Return a success response with the newly created message
    return NextResponse.json({
      message: "Message saved successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to save message"},
      { status: 500 }
    );
  }
}
