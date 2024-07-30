import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const events = await prisma.event.findMany({
                include: {
                    organizer: true,
                    verifications: true,
                },
            });

            res.status(200).json(events);
        } catch (error) {
            console.error("Error fetching events:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    if (req.method === "POST") {
        const { name, description, startDate, endDate, location, posterUrl, verificationIds, organizerId } = req.body;

        try {
            // Check if organizer exists
            const organizerExists = await prisma.user.findUnique({
                where: { id: organizerId },
            });

            if (!organizerExists) {
                return res.status(400).json({ error: "Organizer not found" });
            }

            // Check if all verifications exist
            const verificationsExist = await prisma.verification.findMany({
                where: { id: { in: verificationIds } },
            });

            if (verificationsExist.length !== verificationIds.length) {
                return res.status(400).json({ error: "One or more verifications not found" });
            }

            // Create the event
            const event = await prisma.event.create({
                data: {
                    name,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    location,
                    posterUrl,
                    description,
                    organizer: {
                        connect: { id: organizerId },
                    },
                },
            });

            // Connect verifications
            await prisma.verificationOnEvent.createMany({
                data: verificationIds.map((verificationId: number) => ({
                    eventId: event.id,
                    verificationId,
                })),
            });

            res.status(200).json({ event });
        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
