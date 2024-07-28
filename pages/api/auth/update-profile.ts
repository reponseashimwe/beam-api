import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { name, email } = req.body;

    const session = await getSession(req);

    if (!session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: session.userId },
        data: { name, email },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
