export type PassportStatus = 
  | "not_applied" 
  | "pending" 
  | "valid" 
  | "rejected" 
  | "canceled" 
  | "flight_complete";

export interface PassportRow {
  id: number;
  name: string;
  passport_number: string;
  nationality: string;
  date_of_birth: Date;
  expiry_date: Date;
  status: PassportStatus;
  application_date: Date | null;
  approval_date: Date | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Passport {
  id: number;
  name: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: Date;
  expiryDate: Date;
  status: PassportStatus;
  applicationDate: Date | null;
  approvalDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePassportRequest {
  name: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: Date;
  expiryDate: Date;
  status: PassportStatus;
  applicationDate?: Date;
  approvalDate?: Date;
  notes?: string;
}

export interface UpdatePassportRequest {
  id: number;
  name?: string;
  passportNumber?: string;
  nationality?: string;
  dateOfBirth?: Date;
  expiryDate?: Date;
  status?: PassportStatus;
  applicationDate?: Date;
  approvalDate?: Date;
  notes?: string;
}

export interface ListPassportsRequest {
  search?: string;
  status?: PassportStatus;
  sortBy?: "name" | "date" | "status";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface ListPassportsResponse {
  passports: Passport[];
  total: number;
}

export interface PassportStatsResponse {
  stats: {
    not_applied: number;
    pending: number;
    valid: number;
    rejected: number;
    canceled: number;
    flight_complete: number;
  };
  total: number;
}
