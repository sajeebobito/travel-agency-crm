import { api, APIError } from "encore.dev/api";
import { passportDB } from "./db";
import { CreatePassportRequest, Passport } from "./types";
import { transformPassportRow } from "./utils";

// Creates a new passport record.
export const create = api<CreatePassportRequest, Passport>(
  { expose: true, method: "POST", path: "/passports" },
  async (req) => {
    try {
      const row = await passportDB.queryRow`
        INSERT INTO passports (
          name, passport_number, nationality, date_of_birth, expiry_date, 
          status, application_date, approval_date, notes, updated_at
        ) VALUES (
          ${req.name}, ${req.passportNumber}, ${req.nationality}, 
          ${req.dateOfBirth}, ${req.expiryDate}, ${req.status}, 
          ${req.applicationDate || null}, ${req.approvalDate || null}, 
          ${req.notes || null}, CURRENT_TIMESTAMP
        ) RETURNING *
      `;

      if (!row) {
        throw APIError.internal("Failed to create passport");
      }

      return transformPassportRow(row);
    } catch (error: any) {
      if (error.code === "23505" && error.constraint === "passports_passport_number_key") {
        throw APIError.alreadyExists("Passport number already exists");
      }
      throw error;
    }
  }
);
