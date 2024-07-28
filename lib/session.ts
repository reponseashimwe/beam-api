import { NextApiRequest } from "next";
import { verify } from "jsonwebtoken";
import VARIABLES from "./config";

export const getSession = async (req: NextApiRequest) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return null;

  try {
    const decoded = verify(token, VARIABLES.JWT_TOKEN);
    return decoded as { userId: number };
  } catch (error) {
    return null;
  }
};
