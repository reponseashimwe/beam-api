import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import VARIABLES from "@/lib/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;

  if (typeof token !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }

  try {
    // Verify the token
    const decoded = verify(token, VARIABLES.JWT_TOKEN) as { email: string };

    // Check if the token exists on a user
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user || user.emailVerificationToken !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Set email as verified and remove the token
    await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, emailVerificationToken: null },
    });

    // Return a success message
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error?.message as string });
  }
}
