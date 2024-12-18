CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL
);

CREATE TABLE vacations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    comment TEXT
);

CREATE INDEX idx_vacations_employee_id ON vacations (employee_id);

ALTER TABLE vacations
ADD CONSTRAINT check_start_date_before_end_date
CHECK (start_date <= end_date);
