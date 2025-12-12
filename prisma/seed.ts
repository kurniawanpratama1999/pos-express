import { prisma } from "../src/lib/prisma";

async function main() {
  const transaction = await prisma.$transaction(async (trx) => {
    const role = await trx.role.createMany({
      data: [{ name: "Admin" }],
    });

    const anchor = await trx.anchor.createMany({
      data: [
        { icon: "", name: "user", url: "/user" },
        { icon: "", name: "dashboard", url: "/dashboard" },
        { icon: "", name: "order", url: "/order" },
      ],
    });

    const user = await trx.user.create({
      data: {
        name: "admin",
        roleId: 1,
        email: "admin@mail.com",
        password: "123456",
      },
    });

    const roleAnchor = await trx.roleAnchor.createMany({
      data: [
        {
          roleId: 1,
          anchorId: 1,
          merge: "1-1",
        },
        {
          roleId: 1,
          anchorId: 2,
          merge: "1-2",
        },
        {
          roleId: 1,
          anchorId: 3,
          merge: "1-3",
        },
      ],
    });

    return user;
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
