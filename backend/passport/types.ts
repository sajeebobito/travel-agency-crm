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
  date_of_birth: Date;
  issue_date: Date | null;
  expiry_date: Date;
  status: PassportStatus;
  job_category: string | null;
  total_charge: number;
  amount_paid: number;
  amount_due: number;
  passport_image_url: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Passport {
  id: number;
  name: string;
  passportNumber: string;
  dateOfBirth: Date;
  issueDate: Date | null;
  expiryDate: Date;
  status: PassportStatus;
  jobCategory: string | null;
  totalCharge: number;
  amountPaid: number;
  amountDue: number;
  passportImageUrl: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePassportRequest {
  name: string;
  passportNumber: string;
  dateOfBirth: Date;
  issueDate?: Date;
  expiryDate: Date;
  status: PassportStatus;
  jobCategory?: string;
  totalCharge?: number;
  amountPaid?: number;
  amountDue?: number;
  passportImageUrl?: string;
  notes?: string;
}

export interface UpdatePassportRequest {
  id: number;
  name?: string;
  passportNumber?: string;
  dateOfBirth?: Date;
  issueDate?: Date;
  expiryDate?: Date;
  status?: PassportStatus;
  jobCategory?: string;
  totalCharge?: number;
  amountPaid?: number;
  amountDue?: number;
  passportImageUrl?: string;
  notes?: string;
}

export interface ListPassportsRequest {
  search?: string;
  status?: PassportStatus;
  jobCategory?: string;
  sortBy?: "name" | "date" | "status" | "jobCategory";
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

export interface JobCategory {
  id: number;
  name: string;
  createdAt: Date;
}

export interface CreateJobCategoryRequest {
  name: string;
}

export interface ListJobCategoriesResponse {
  categories: JobCategory[];
}
