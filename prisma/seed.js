const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@beam.com" },
    update: {
      isAdmin: true
    },
    create: {
      email: "admin@beam.com",
      name: "Admin User",
      password: hashedPassword,
      isEmailVerified: true,
      isAdmin: true
    },
  });

  console.log("Admin user seeded");

  await prisma.verification.create({
    data: {
      userId: 2, // Replace with the actual user ID
      code: "123456", // Replace with the verification code
      expiresAt: new Date(), // Replace with the expiration date
    },
  });

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
}