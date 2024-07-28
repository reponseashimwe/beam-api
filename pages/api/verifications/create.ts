import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, requiredDocs, isAutoApproved, description } = req.body;

    let requiredDocsArray =
      requiredDocs.trim().length > 0
        ? requiredDocs
            .trim()
            .split("|")
            .map((doc: string) => doc.trim())
        : [];

    try {
      const verification = await prisma.verification.create({
        data: {
          name,
          requiredDocs: requiredDocsArray,
          isAutoApproved,
          description,
        },
      });
      res.status(200).json({ verification });
    } catch (error) {
      res.status(500).json({ error: "Error creating verification" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
