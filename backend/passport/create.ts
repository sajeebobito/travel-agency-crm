import { api, APIError } from "encore.dev/api";
import { passportDB } from "./db";
import { CreatePassportRequest, Passport } from "./types";
import { transformPassportRow } from "./utils";

// Creates a new passport record.
export const create = api<CreatePassportRequest, Passport>(
  { expose: true, method: "POST", path: "/passports" },
  async (req) => {
    try {
      const totalCharge = req.totalCharge || 0;
      const amountPaid = req.amountPaid || 0;
      const amountDue = totalCharge - amountPaid;

      const row = await passportDB.queryRow`
        INSERT INTO passports (
          name, passport_number, date_of_birth, issue_date, expiry_date, 
          status, job_category, total_charge, amount_paid, amount_due, 
          passport_image_url, notes, updated_at
        ) VALUES (
          ${req.name}, ${req.passportNumber}, ${req.dateOfBirth}, 
          ${req.issueDate || null}, ${req.expiryDate}, ${req.status}, 
          ${req.jobCategory || null}, ${totalCharge}, 
          ${amountPaid}, ${amountDue}, 
          ${req.passportImageUrl || null}, ${req.notes || null}, CURRENT_TIMESTAMP
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
