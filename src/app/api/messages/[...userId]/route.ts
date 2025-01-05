import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/utilities/prisma";

// Handle GET requests
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId;
  try {
    // Fetch messages where the user is either the sender or recipient
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ]
      },
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Error fetching messages" }, { status: 500 });
  }
}

// Handle POST requests (if applicable)
export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log(data)
  console.log("Monkey")
  return NextResponse.json({ message: "Data received", data });
}
