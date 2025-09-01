import { api, APIError } from "encore.dev/api";
import { passportDB } from "./db";
import { Passport } from "./types";
import { transformPassportRow } from "./utils";

interface GetPassportRequest {
  id: number;
}

// Retrieves a passport by ID.
export const get = api<GetPassportRequest, Passport>(
  { expose: true, method: "GET", path: "/passports/:id" },
  async (req) => {
    const row = await passportDB.queryRow`
      SELECT * FROM passports WHERE id = ${req.id}
    `;

    if (!row) {
      throw APIError.notFound("Passport not found");
    }

    return transformPassportRow(row);
  }
);
