import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const categories = await prisma.category.findMany({
        include: { events: true },
      });
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: "Error fetching categories" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
