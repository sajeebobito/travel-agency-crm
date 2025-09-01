CREATE TABLE passports (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  passport_number VARCHAR(100) NOT NULL UNIQUE,
  nationality VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'not_applied',
  application_date DATE,
  approval_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_passports_status ON passports(status);
CREATE INDEX idx_passports_name ON passports(name);
CREATE INDEX idx_passports_passport_number ON passports(passport_number);
