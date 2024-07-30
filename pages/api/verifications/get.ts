import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const verifications = await prisma.verification.findMany({
        include: { users: true },
      });
      res.status(200).json(verifications);
    } catch (error) {
      res.status(500).json({ error: "Error fetching verifications" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
