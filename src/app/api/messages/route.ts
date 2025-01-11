import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const contact = searchParams.get("contact");

  if (!userId || !contact) {
    return NextResponse.json(
      { error: "Missing userId or contact" },
      { status: 400 }
    );
  }

  console.log(`Fetching messages for userId: ${userId}, contact: ${contact}`);

  try {
    // Fetch messages between the user and the selected contact
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: contact },
          { senderId: contact, recipientId: userId },
        ],
      },
    });
    console.log(messages)

    if (!messages || messages.length === 0) {
      return NextResponse.json({ messages: [] }); // Handle case where no messages are found
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Error fetching messages" },
      { status: 500 }
    );
  }
}

// Handle POST requests (if applicable)
export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log(data);
  const { senderId, recipientId, text, timestamp, file } = data;

  try {
    // Create a new message in the database using Prisma
    const newMessage = await prisma.messages.create({
      data: {
        senderId,
        recipientId,
        text,
        timestamp,
        file,
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
