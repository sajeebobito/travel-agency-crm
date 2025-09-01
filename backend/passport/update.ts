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
    if (req.nationality !== undefined) {
      updates.push(`nationality = $${paramIndex++}`);
      params.push(req.nationality);
    }
    if (req.dateOfBirth !== undefined) {
      updates.push(`date_of_birth = $${paramIndex++}`);
      params.push(req.dateOfBirth);
    }
    if (req.expiryDate !== undefined) {
      updates.push(`expiry_date = $${paramIndex++}`);
      params.push(req.expiryDate);
    }
    if (req.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      params.push(req.status);
    }
    if (req.applicationDate !== undefined) {
      updates.push(`application_date = $${paramIndex++}`);
      params.push(req.applicationDate);
    }
    if (req.approvalDate !== undefined) {
      updates.push(`approval_date = $${paramIndex++}`);
      params.push(req.approvalDate);
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
