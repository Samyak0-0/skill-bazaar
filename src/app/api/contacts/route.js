import { getAuthSession } from "@/utilities/auth";
import { prisma } from "@/utilities/prisma";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const userMail = searchParams.get("usermail");

  try {
    const users = await prisma.user.findMany({
      // where: {
      //   NOT: {
      //     email: userMail,
      //   },
      // },
    });
    return new NextResponse(JSON.stringify(users, { status: 200 }));
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
