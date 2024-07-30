import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { categoryId, verificationId, date } = req.body;

    let eventsIds = [],
      opts: any = {};

    if (categoryId && categoryId.length > 0) {
      opts = { ...opts, categoryId: parseInt(categoryId, 10) };
    }

    if (verificationId && verificationId.length > 0) {
      eventsIds = (
        await prisma.verificationOnEvent.findMany({
          where: { verificationId: parseInt(verificationId, 10) },
        })
      ).map((v) => v.eventId);
      opts = { ...opts, id: { in: eventsIds } };
    }

    if (date && date.length > 0) {
      const parsedDate = new Date(date);
      opts.startDate = { gte: parsedDate };
      opts.endDate = { lte: parsedDate };
    }

    const events = await prisma.event.findMany({
      where: {
        ...opts,
      },
      include: {
        organizer: true,
        verifications: {
          include: { verification: true },
        },
      },
    });

    res.status(200).json(events);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
