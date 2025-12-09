import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@example.com",
      password: "123456",
    },
  });
}

main()
  .then(() => {
    console.log("Seeding selesai!");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
