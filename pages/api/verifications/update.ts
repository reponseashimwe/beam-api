import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id, status, reason, changed, uploads, requestChanges } = req.body;

    // Validate required fields
    if (!id || status === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Update the verification request in the database
      const updatedVerificationRequest = await prisma.userVerification.update({
        where: { id: parseInt(id, 10) },
        data: {
          status,
          reason: reason || null,
          requestChanges: requestChanges || null,
          changed: changed || false,
          uploads,
        },
      });

      return res.status(200).json(updatedVerificationRequest);
    } catch (error) {
      console.error("Error updating verification request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Method Not Allowed
    return res.status(405).json({ error: "Method not allowed" });
  }
}
