import { api, APIError } from "encore.dev/api";
import { passportDB } from "./db";

interface DeletePassportRequest {
  id: number;
}

// Deletes a passport record.
export const deletePassport = api<DeletePassportRequest, void>(
  { expose: true, method: "DELETE", path: "/passports/:id" },
  async (req) => {
    const result = await passportDB.queryRow`
      DELETE FROM passports WHERE id = ${req.id} RETURNING id
    `;

    if (!result) {
      throw APIError.notFound("Passport not found");
    }
  }
);
