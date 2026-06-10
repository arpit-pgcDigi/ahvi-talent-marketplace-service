import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "libs/prisma/schema.prisma",
  migrations: {
    path: "libs/prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});