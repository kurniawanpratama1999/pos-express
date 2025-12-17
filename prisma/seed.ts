import { prisma } from "../src/lib/prisma";
import { Hash } from "..//src/modules/utils/Hash";
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
        password: await Hash.make("1234"),
      },
    });

    const roleAnchor = await trx.roleAnchor.createMany({
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
    });

    return roleAnchor;
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
