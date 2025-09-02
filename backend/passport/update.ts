import { api, APIError } from "encore.dev/api";
import { passportDB } from "./db";
import { UpdatePassportRequest, Passport } from "./types";
import { transformPassportRow } from "./utils";

// Updates an existing passport record.
export const update = api<UpdatePassportRequest, Passport>(
  { expose: true, method: "PUT", path: "/passports/:id" },
  async (req) => {
    try {
      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (req.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        params.push(req.name);
      }
      if (req.passportNumber !== undefined) {
        updates.push(`passport_number = $${paramIndex++}`);
        params.push(req.passportNumber);
      }
      if (req.dateOfBirth !== undefined) {
        const dateOfBirth = new Date(req.dateOfBirth);
        if (isNaN(dateOfBirth.getTime())) {
          throw APIError.invalidArgument("Invalid date of birth");
        }
        updates.push(`date_of_birth = $${paramIndex++}`);
        params.push(dateOfBirth);
      }
      if (req.issueDate !== undefined) {
        if (req.issueDate === null) {
          updates.push(`issue_date = $${paramIndex++}`);
          params.push(null);
        } else {
          const issueDate = new Date(req.issueDate);
          if (isNaN(issueDate.getTime())) {
            throw APIError.invalidArgument("Invalid issue date");
          }
          updates.push(`issue_date = $${paramIndex++}`);
          params.push(issueDate);
        }
      }
      if (req.expiryDate !== undefined) {
        const expiryDate = new Date(req.expiryDate);
        if (isNaN(expiryDate.getTime())) {
          throw APIError.invalidArgument("Invalid expiry date");
        }
        updates.push(`expiry_date = $${paramIndex++}`);
        params.push(expiryDate);
      }
      if (req.status !== undefined) {
        updates.push(`status = $${paramIndex++}`);
        params.push(req.status);
      }
      if (req.jobCategory !== undefined) {
        updates.push(`job_category = $${paramIndex++}`);
        params.push(req.jobCategory);
      }
      if (req.totalCharge !== undefined) {
        updates.push(`total_charge = $${paramIndex++}`);
        params.push(req.totalCharge);
      }
      if (req.amountPaid !== undefined) {
        updates.push(`amount_paid = $${paramIndex++}`);
        params.push(req.amountPaid);
      }
      if (req.amountDue !== undefined) {
        updates.push(`amount_due = $${paramIndex++}`);
        params.push(req.amountDue);
      }
      if (req.passportImageUrl !== undefined) {
        updates.push(`passport_image_url = $${paramIndex++}`);
        params.push(req.passportImageUrl);
      }
      if (req.notes !== undefined) {
        updates.push(`notes = $${paramIndex++}`);
        params.push(req.notes);
      }

      if (updates.length === 0) {
        throw APIError.invalidArgument("No fields to update");
      }

      // Calculate amount due if both total charge and amount paid are being updated
      if (req.totalCharge !== undefined || req.amountPaid !== undefined) {
        // Get current values if not being updated
        const currentRow = await passportDB.queryRow`
          SELECT total_charge, amount_paid FROM passports WHERE id = ${req.id}
        `;
        
        if (currentRow) {
          const totalCharge = req.totalCharge !== undefined ? req.totalCharge : currentRow.total_charge;
          const amountPaid = req.amountPaid !== undefined ? req.amountPaid : currentRow.amount_paid;
          const amountDue = totalCharge - amountPaid;
          
          updates.push(`amount_due = $${paramIndex++}`);
          params.push(amountDue);
        }
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      params.push(req.id);

      const query = `
        UPDATE passports 
        SET ${updates.join(", ")} 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;

      const row = await passportDB.rawQueryRow(query, ...params);

      if (!row) {
        throw APIError.notFound("Passport not found");
      }

      return transformPassportRow(row);
    } catch (error: any) {
      console.error("Error updating passport:", error);
      
      if (error.code === "23505" && error.constraint === "passports_passport_number_key") {
        throw APIError.alreadyExists("Passport number already exists");
      }
      
      if (error.message && error.message.includes("invalid input syntax")) {
        throw APIError.invalidArgument("Invalid data format provided");
      }
      
      throw error;
    }
  }
);
