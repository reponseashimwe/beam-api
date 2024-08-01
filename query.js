const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Find all events without any bookings
  const eventsWithoutBookings = await prisma.event.findMany({
    where: {
      name: "Software Engineers Summit",
      bookings: {
        none: {},
      },
    },
  });

  // Delete related records manually
  await Promise.all(
    eventsWithoutBookings.map(async (event) => {
      // Delete related verifications
      await prisma.verificationOnEvent.deleteMany({
        where: {
          eventId: event.id,
        },
      });

      // Delete the event itself
      await prisma.event.delete({
        where: {
          id: event.id,
        },
      });
    })
  );

  console.log("Deleted events without bookings and their related records.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
