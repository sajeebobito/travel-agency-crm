import { PassportRow, Passport } from "./types";

export function transformPassportRow(row: PassportRow): Passport {
  return {
    id: row.id,
    name: row.name,
    passportNumber: row.passport_number,
    nationality: row.nationality,
    dateOfBirth: row.date_of_birth,
    expiryDate: row.expiry_date,
    status: row.status,
    applicationDate: row.application_date,
    approvalDate: row.approval_date,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
