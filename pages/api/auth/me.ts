import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { tree } from "next/dist/build/templates/app-page";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getSession(req);

    if (!session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },

        include: {
          bookings: { include: { event: true } },
          events: {
            include: {
              bookings: {
                include: { user: true },
              },
              organizer: true,
              verifications: {
                include: { verification: true },
              },
            },
          },
          verifications: { include: { verification: true } },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
