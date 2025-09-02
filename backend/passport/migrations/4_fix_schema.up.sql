-- First, check if the columns exist before adding them
DO $$ 
BEGIN
    -- Check and add issue_date if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'passports' AND column_name = 'issue_date') THEN
        ALTER TABLE passports ADD COLUMN issue_date DATE;
    END IF;
    
    -- Check and add job_category if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'passports' AND column_name = 'job_category') THEN
        ALTER TABLE passports ADD COLUMN job_category VARCHAR(100);
    END IF;
    
    -- Check and add total_charge if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'passports' AND column_name = 'total_charge') THEN
        ALTER TABLE passports ADD COLUMN total_charge DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Check and add amount_paid if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'passports' AND column_name = 'amount_paid') THEN
        ALTER TABLE passports ADD COLUMN amount_paid DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Check and add amount_due if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'passports' AND column_name = 'amount_due') THEN
        ALTER TABLE passports ADD COLUMN amount_due DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Check and add passport_image_url if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'passports' AND column_name = 'passport_image_url') THEN
        ALTER TABLE passports ADD COLUMN passport_image_url TEXT;
    END IF;
END $$;

-- Remove unused columns if they exist
ALTER TABLE passports DROP COLUMN IF EXISTS nationality;
ALTER TABLE passports DROP COLUMN IF EXISTS application_date;
ALTER TABLE passports DROP COLUMN IF EXISTS approval_date;

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_passports_job_category ON passports(job_category);
CREATE INDEX IF NOT EXISTS idx_passports_total_charge ON passports(total_charge);
CREATE INDEX IF NOT EXISTS idx_passports_image ON passports(passport_image_url);
