import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/session"; // Import your custom getSession function
import { prisma } from "@/lib/prisma"; // Import your Prisma client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.userId;

  try {
    const verifications = await prisma.userVerification.findMany({
      where: { userId },
      include: {
        verification: true,
      },
    });

    res.status(200).json(verifications);
  } catch (error) {
    console.error("Error fetching verifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
