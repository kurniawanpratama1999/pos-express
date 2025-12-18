import { prisma } from "../src/lib/prisma";
import { Hash } from "../src/modules/utils/Hash";
async function main() {
  const transaction = await prisma.$transaction([
    prisma.role.createMany({
      data: [{ name: "Admin" }],
    }),

    prisma.anchor.createMany({
      data: [
        { icon: "", name: "user", url: "/user" },
        { icon: "", name: "dashboard", url: "/dashboard" },
        { icon: "", name: "order", url: "/order" },
      ],
    }),

    prisma.user.create({
      data: {
        name: "admin",
        roleId: 1,
        email: "admin@mail.com",
        password: await Hash.make("admin#123"),
      },
    }),

    prisma.roleAnchor.createMany({
      data: [
        {
          roleId: 1,
          anchorId: 1,
        },
        {
          roleId: 1,
          anchorId: 2,
        },
        {
          roleId: 1,
          anchorId: 3,
        },
      ],
    }),
  ]);

  console.log(transaction);
}

main()
  .then(() => {
    console.log("Seeding selesai!");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
