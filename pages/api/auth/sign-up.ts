import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import VARIABLES from "@/lib/config";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    try {
      const existing = await prisma.user.findUnique({ where: { email } });

      if (existing) {
        return res.status(400).json({ message: "Email already used" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign({ email }, VARIABLES.JWT_TOKEN, {
        expiresIn: "30d",
      });

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          isEmailVerified: false,
          emailVerificationToken: token,
        },
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
        message: "User created successfully. Please verify your email.",
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
