-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Service table
CREATE TABLE IF NOT EXISTS public."Service" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Specialization table
CREATE TABLE IF NOT EXISTS public."Specialization" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create FamilyProfile table (No separate User table; links directly to auth.users)
CREATE TABLE IF NOT EXISTS public."FamilyProfile" (
    id UUID PRIMARY KEY, -- References auth.users(id) from Supabase Auth
    email TEXT UNIQUE NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" DATE, -- Populated at final Step
    address TEXT,
    city TEXT, -- Populated at final Step
    country TEXT, -- Populated at final Step
    "postalCode" TEXT, -- Populated at final Step
    languages TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    "stepsCompleted" INTEGER DEFAULT 0 NOT NULL, -- Tracks number of completed onboarding steps
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create CaregiverProfile table (No separate User table; links directly to auth.users)
CREATE TABLE IF NOT EXISTS public."CaregiverProfile" (
    id UUID PRIMARY KEY, -- References auth.users(id) from Supabase Auth
    email TEXT UNIQUE NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" DATE, -- Populated at final Step
    bio TEXT, -- Populated at final Step
    gender TEXT, -- Populated at final Step
    "experienceYears" INTEGER DEFAULT 0, -- Populated at final Step
    "hourlyRate" NUMERIC(10, 2), -- Populated at final Step
    currency TEXT DEFAULT 'EUR' NOT NULL,
    languages TEXT[], -- Populated at final Step
    certifications TEXT[], -- Populated at final Step
    services TEXT[] DEFAULT '{}'::TEXT[], -- Populated at Step 3
    specializations TEXT[] DEFAULT '{}'::TEXT[], -- Populated at Step 3
    "availabilityStatus" TEXT DEFAULT 'AVAILABLE' NOT NULL,
    "verificationStatus" TEXT DEFAULT 'PENDING' NOT NULL,
    "verificationFeePaid" BOOLEAN DEFAULT false NOT NULL,
    "isPremium" BOOLEAN DEFAULT false NOT NULL,
    rating DOUBLE PRECISION DEFAULT 0.0 NOT NULL,
    "reviewCount" INTEGER DEFAULT 0 NOT NULL,
    "stepsCompleted" INTEGER DEFAULT 0 NOT NULL, -- Tracks number of completed onboarding steps
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Booking table
CREATE TABLE IF NOT EXISTS public."Booking" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "familyId" UUID NOT NULL REFERENCES public."FamilyProfile"(id) ON DELETE CASCADE,
    "caregiverId" UUID NOT NULL REFERENCES public."CaregiverProfile"(id) ON DELETE CASCADE,
    "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "hourlyRate" NUMERIC(10, 2) NOT NULL,
    "commissionRate" NUMERIC(5, 2) NOT NULL,
    "totalAmount" NUMERIC(10, 2) NOT NULL,
    "commissionFee" NUMERIC(10, 2) NOT NULL,
    "caregiverShare" NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'EUR' NOT NULL,
    status TEXT CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING' NOT NULL,
    "paymentStatus" TEXT CHECK ("paymentStatus" IN ('UNPAID', 'PAID', 'REFUNDED')) DEFAULT 'UNPAID' NOT NULL,
    "paymentIntentId" TEXT UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Availability table
CREATE TABLE IF NOT EXISTS public."Availability" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "caregiverId" UUID NOT NULL REFERENCES public."CaregiverProfile"(id) ON DELETE CASCADE,
    "dayOfWeek" INTEGER NOT NULL CHECK ("dayOfWeek" >= 0 AND "dayOfWeek" <= 6),
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Favorite table
CREATE TABLE IF NOT EXISTS public."Favorite" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "familyId" UUID NOT NULL REFERENCES public."FamilyProfile"(id) ON DELETE CASCADE,
    "caregiverId" UUID NOT NULL REFERENCES public."CaregiverProfile"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE ("familyId", "caregiverId")
);

-- 8. Create Document table
CREATE TABLE IF NOT EXISTS public."Document" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "caregiverId" UUID NOT NULL REFERENCES public."CaregiverProfile"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create Review table
CREATE TABLE IF NOT EXISTS public."Review" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "bookingId" UUID UNIQUE NOT NULL REFERENCES public."Booking"(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public."FamilyProfile"(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES public."CaregiverProfile"(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (family_id, caregiver_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_family_email ON public."FamilyProfile"(email);
CREATE INDEX IF NOT EXISTS idx_caregiver_email ON public."CaregiverProfile"(email);
CREATE INDEX IF NOT EXISTS idx_caregiver_rate ON public."CaregiverProfile"("hourlyRate");
CREATE INDEX IF NOT EXISTS idx_caregiver_location ON public."CaregiverProfile"(gender, "experienceYears");
CREATE INDEX IF NOT EXISTS idx_booking_family ON public."Booking"("familyId");
CREATE INDEX IF NOT EXISTS idx_booking_caregiver ON public."Booking"("caregiverId");
CREATE INDEX IF NOT EXISTS idx_conv_family ON public.conversations(family_id);
CREATE INDEX IF NOT EXISTS idx_conv_caregiver ON public.conversations(caregiver_id);

-- 11. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('family', 'caregiver')),
    sender_id UUID NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('text', 'request')),
    content JSONB NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_msg_conv ON public.messages(conversation_id);

-- 13. Create AuditLog table
CREATE TABLE IF NOT EXISTS public."AuditLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed default services and specializations
INSERT INTO public."Service" (name) VALUES 
('Elderly Companionship'), 
('Dementia & Alzheimer Care'), 
('Meal Preparation & Nutrition'), 
('Medication & Vitals Tracking'), 
('Mobility & Transfer Assistance'),
('Personal Hygiene & Grooming'),
('Pediatric Home Care')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public."Specialization" (name) VALUES 
('Certified Nursing Assistant (CNA)'), 
('Registered Nurse (RN)'), 
('Physical Therapist Helper'), 
('Hospice & Palliative Care'), 
('Dementia Specialist'),
('Nutritional Specialist')
ON CONFLICT (name) DO NOTHING;

-- 14. Initialize Supabase Storage Bucket for CareNest
INSERT INTO storage.buckets (id, name, public)
VALUES ('care-nest', 'care-nest', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view certification files
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'care-nest');

-- Allow uploads to the care-nest bucket
CREATE POLICY "Public Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'care-nest');

