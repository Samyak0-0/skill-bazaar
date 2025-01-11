import { prisma } from "@/utilities/prisma";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const userMail = searchParams.get("usermail");

  try {
    const user = await prisma.user.findUnique({
      where: { email: userMail },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        contacts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    const contacts = await prisma.user.findMany({
      where: {
        id: { in: user.contacts },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({user,contacts}, { status: 200 });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
