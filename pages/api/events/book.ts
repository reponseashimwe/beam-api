import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.userId;

  if (req.method === "POST") {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      //   await prisma.userBooking.create({
      //     data: {
      //       userId,
      //       eventId: eventId,
      //       status: true,
      //     },
      //   });
      const event = await prisma.event.findUnique({ where: { id: eventId } });

      await prisma.event.update({
        data: { takenSeats: (event?.takenSeats || 0) + 1 },
        where: { id: eventId },
      });
      return res.status(200).json(true);
    } catch (error) {
      console.error("Error booking the event", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Method Not Allowed
    return res.status(405).json({ error: "Method not allowed" });
  }
}
