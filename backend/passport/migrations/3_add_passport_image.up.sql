-- Add passport image column
ALTER TABLE passports ADD COLUMN passport_image_url TEXT;

-- Add index for image URL
CREATE INDEX idx_passports_image ON passports(passport_image_url);
