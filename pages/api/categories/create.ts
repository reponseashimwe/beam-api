import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, description } = req.body;

    try {
      const category = await prisma.category.create({
        data: {
          name,
          description,
        },
      });
      res.status(200).json({ category });
    } catch (error) {
      res.status(500).json({ error: "Error creating category" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
