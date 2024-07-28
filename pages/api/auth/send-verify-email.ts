import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import VARIABLES from "@/lib/config";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      const token = jwt.sign({ email }, VARIABLES.JWT_TOKEN, {
        expiresIn: "30d",
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerificationToken: token },
      });

      // Send verification email
      const verificationUrl = `${VARIABLES.FRONTEND_URL}/verify-email?token=${token}`;

      sendEmail(
        [email],
        "Email Verification",
        `<p>Please click the following link to verify your email:</p>
         <a href="${verificationUrl}">Verify Email</a>`
      );

      return res.status(201).json({
        message: "Verification link sent. Please verify your email.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
