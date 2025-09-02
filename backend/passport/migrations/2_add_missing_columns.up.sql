-- Add missing columns to passports table
ALTER TABLE passports ADD COLUMN issue_date DATE;
ALTER TABLE passports ADD COLUMN job_category VARCHAR(100);
ALTER TABLE passports ADD COLUMN total_charge DECIMAL(10,2) DEFAULT 0;
ALTER TABLE passports ADD COLUMN amount_paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE passports ADD COLUMN amount_due DECIMAL(10,2) DEFAULT 0;

-- Remove nationality column as it's not used in the application
ALTER TABLE passports DROP COLUMN IF EXISTS nationality;
ALTER TABLE passports DROP COLUMN IF EXISTS application_date;
ALTER TABLE passports DROP COLUMN IF EXISTS approval_date;

-- Add indexes for the new columns
CREATE INDEX idx_passports_job_category ON passports(job_category);
CREATE INDEX idx_passports_total_charge ON passports(total_charge);
