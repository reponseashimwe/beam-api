import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Update the verification request in the database
      await prisma.userVerification.update({
        where: { id: parseInt(id as string, 10) },
        data: { status: true },
      });
      return res.status(200).json(true);
    } catch (error) {
      console.error("Error updating verification request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Method Not Allowed
    return res.status(405).json({ error: "Method not allowed" });
  }
}
