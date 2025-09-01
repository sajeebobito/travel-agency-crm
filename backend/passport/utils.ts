import { PassportRow, Passport } from "./types";

export function transformPassportRow(row: PassportRow): Passport {
  return {
    id: row.id,
    name: row.name,
    passportNumber: row.passport_number,
    dateOfBirth: row.date_of_birth,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    status: row.status,
    jobCategory: row.job_category,
    totalCharge: row.total_charge,
    amountPaid: row.amount_paid,
    amountDue: row.amount_due,
    passportImageUrl: row.passport_image_url,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
