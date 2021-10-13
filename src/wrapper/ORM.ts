import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const ORM = new PrismaClient({
  log: ["info", { emit: "event", level: "query" }, "warn", "error"],
});

ORM.$on("query", (event) => {
  console.log(chalk.blue(":query  -- "), event.query);
  if (event.params !== "[]") {
    console.log(chalk.blue(":params -- "), `${event.params}`);
  }
});

export default ORM;
