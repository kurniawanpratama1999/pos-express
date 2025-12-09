import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { Config } from "../modules/configs/Config";
const adapter = new PrismaMariaDb({
  host: Config.db_host(),
  user: Config.db_user(),
  password: Config.db_password(),
  database: Config.db_name(),
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
