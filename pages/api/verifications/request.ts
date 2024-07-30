import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import { sendEmail } from "@/lib/mailer";
import { useId } from "react";
import VARIABLES from "@/lib/config";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getSession(req);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session.userId;
    // Extract data from the request body
    const { verificationId, uploads, reason, requestChanges } = req.body;

    const verification = await prisma.verification.findUnique({
      where: { id: verificationId },
    });

    const status = verification?.isAutoApproved ? true : null;

    // Validate required fields
    if (!verificationId || !uploads) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Create a new verification request in the database
      const verificationRequest = await prisma.userVerification.create({
        data: {
          userId: userId,
          verificationId: parseInt(verificationId, 10),
          uploads: uploads,
          status,
        },
      });

      if (status === true) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        sendEmail(
          [user?.email as string],
          "Verification request approved",
          `<p>Your verification request for <strong>${verification?.name}</strong> has been approved. Now you can book or reserve seats in events exclusive for this verification category</p>
           Visit the web for more events exploration <a href="${VARIABLES.FRONTEND_URL}">here</a>`
        );
      } else {
      }

      return res.status(201).json(verificationRequest);
    } catch (error) {
      console.error("Error creating verification request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Method Not Allowed
    return res.status(405).json({ error: "Method not allowed" });
  }
}
