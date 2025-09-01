import { SQLDatabase } from "encore.dev/storage/sqldb";

export const passportDB = new SQLDatabase("passport", {
  migrations: "./migrations",
});
