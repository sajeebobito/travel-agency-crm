import { api, APIError } from "encore.dev/api";
import { passportDB } from "./db";
import { UpdatePassportRequest, Passport } from "./types";
import { transformPassportRow } from "./utils";

// Updates an existing passport record.
export const update = api<UpdatePassportRequest, Passport>(
  { expose: true, method: "PUT", path: "/passports/:id" },
  async (req) => {
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
      updates.push(`date_of_birth = $${paramIndex++}`);
      params.push(req.dateOfBirth);
    }
    if (req.issueDate !== undefined) {
      updates.push(`issue_date = $${paramIndex++}`);
      params.push(req.issueDate);
    }
    if (req.expiryDate !== undefined) {
      updates.push(`expiry_date = $${paramIndex++}`);
      params.push(req.expiryDate);
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

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(req.id);

    const query = `
      UPDATE passports 
      SET ${updates.join(", ")} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    try {
      const row = await passportDB.rawQueryRow(query, ...params);

      if (!row) {
        throw APIError.notFound("Passport not found");
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
