-- Finovo Database Schema for Supabase

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMPTZ,
    "image" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Account table (for NextAuth)
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- Create Session table (for NextAuth)
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- Create Expense table
CREATE TABLE IF NOT EXISTS "Expense" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- Create VerificationToken table (for NextAuth)
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMPTZ NOT NULL
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- Create regular indexes for performance
CREATE INDEX IF NOT EXISTS "Expense_userId_idx" ON "Expense"("userId");
CREATE INDEX IF NOT EXISTS "Expense_category_idx" ON "Expense"("category");
CREATE INDEX IF NOT EXISTS "Expense_date_idx" ON "Expense"("date");

-- Add foreign key constraints
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert demo user and expenses
INSERT INTO "User" ("id", "name", "email", "password", "createdAt", "updatedAt") 
VALUES (
    'demo-user-123',
    'Demo User',
    'demo@finovo.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLlYuZQw6TpWZ7u', -- demo123
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Insert demo expenses
INSERT INTO "Expense" ("id", "amount", "category", "description", "date", "createdAt", "updatedAt", "userId") VALUES
('exp-1', 25.50, 'Food', 'Lunch at cafe', '2024-01-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'demo-user-123'),
('exp-2', 12.30, 'Transport', 'Bus ticket', '2024-01-16', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'demo-user-123'),
('exp-3', 85.00, 'Utilities', 'Internet bill', '2024-01-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'demo-user-123'),
('exp-4', 150.00, 'Shopping', 'Groceries', '2024-01-12', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'demo-user-123'),
('exp-5', 45.20, 'Entertainment', 'Movie tickets', '2024-01-18', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'demo-user-123'),
('exp-6', 32.75, 'Food', 'Dinner', '2024-01-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'demo-user-123'),
('exp-7', 15.00, 'Transport', 'Taxi ride', '2024-01-21', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'demo-user-123')
ON CONFLICT ("id") DO NOTHING;
