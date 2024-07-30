import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Import your Prisma client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const verifications = await prisma.userVerification.findMany({
      where: { status: null, requestChanges: null },
      include: {
        verification: true,
        user: true,
      },
    });

    res.status(200).json(verifications);
  } catch (error) {
    console.error("Error fetching verifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
