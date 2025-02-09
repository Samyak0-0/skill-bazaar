import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export async function POST(req) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userMail, location, phone } = req.body;

  if (!userMail) {
    return res.status(400).json({ error: "Missing userMail" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: userMail },
      data: { location, phone },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}