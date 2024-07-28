const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@beam.com" },
    update: {},
    create: {
      email: "admin@beam.com",
      name: "Admin User",
      password: hashedPassword,
      isEmailVerified: true,
    },
  });

  console.log("Admin user seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
