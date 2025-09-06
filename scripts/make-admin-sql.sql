-- SQL script to make a user admin
-- Run this directly in your Supabase SQL editor

-- First, add the isAdmin column if it doesn't exist
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT false;

-- Make the user admin (replace 'baran.caki@hotmail.com' with the actual email)
UPDATE "User" 
SET "isAdmin" = true 
WHERE email = 'baran.caki@hotmail.com';

-- Verify the change
SELECT id, name, email, "isAdmin" 
FROM "User" 
WHERE email = 'baran.caki@hotmail.com';
