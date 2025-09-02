import { api, APIError } from "encore.dev/api";
import { passportDB } from "./db";
import { CreatePassportRequest, Passport } from "./types";
import { transformPassportRow } from "./utils";

// Creates a new passport record.
export const create = api<CreatePassportRequest, Passport>(
  { expose: true, method: "POST", path: "/passports" },
  async (req) => {
    try {
      // Calculate amount due
      const totalCharge = req.totalCharge || 0;
      const amountPaid = req.amountPaid || 0;
      const amountDue = totalCharge - amountPaid;

      // Validate dates
      const dateOfBirth = new Date(req.dateOfBirth);
      const expiryDate = new Date(req.expiryDate);
      const issueDate = req.issueDate ? new Date(req.issueDate) : null;

      if (isNaN(dateOfBirth.getTime())) {
        throw APIError.invalidArgument("Invalid date of birth");
      }
      if (isNaN(expiryDate.getTime())) {
        throw APIError.invalidArgument("Invalid expiry date");
      }
      if (issueDate && isNaN(issueDate.getTime())) {
        throw APIError.invalidArgument("Invalid issue date");
      }

      const row = await passportDB.queryRow`
        INSERT INTO passports (
          name, 
          passport_number, 
          date_of_birth, 
          issue_date, 
          expiry_date, 
          status, 
          job_category, 
          total_charge, 
          amount_paid, 
          amount_due, 
          passport_image_url, 
          notes, 
          created_at,
          updated_at
        ) VALUES (
          ${req.name}, 
          ${req.passportNumber}, 
          ${dateOfBirth}, 
          ${issueDate}, 
          ${expiryDate}, 
          ${req.status}, 
          ${req.jobCategory || null}, 
          ${totalCharge}, 
          ${amountPaid}, 
          ${amountDue}, 
          ${req.passportImageUrl || null}, 
          ${req.notes || null}, 
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        ) RETURNING *
      `;

      if (!row) {
        throw APIError.internal("Failed to create passport");
      }

      return transformPassportRow(row);
    } catch (error: any) {
      console.error("Error creating passport:", error);
      
      if (error.code === "23505" && error.constraint === "passports_passport_number_key") {
        throw APIError.alreadyExists("Passport number already exists");
      }
      
      if (error.message && error.message.includes("invalid input syntax")) {
        throw APIError.invalidArgument("Invalid data format provided");
      }
      
      if (error.message && error.message.includes("column") && error.message.includes("does not exist")) {
        throw APIError.internal("Database schema error. Please contact support.");
      }
      
      throw APIError.internal(`Failed to create passport: ${error.message}`);
    }
  }
);
