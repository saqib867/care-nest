const { Client } = require("pg");
require("dotenv").config({ path: "../.env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set in .env");

const caregiversToSeed = [
  {
    id: "44444444-4444-4444-4444-444444444441",
    email: "elena.r@carenest.de",
    firstName: "Elena",
    lastName: "Rostova",
    dateOfBirth: "1992-04-12",
    bio: "Certified Nursing Assistant with 8+ years of experience specializing in dementia care, physical therapy support, and elderly companionship. Warm, patient, and dedicated to promoting independence.",
    gender: "Female",
    experienceYears: 8,
    hourlyRate: 45.00,
    currency: "EUR",
    languages: ["German", "English", "Russian"],
    certifications: ["Certified Nursing Assistant (CNA)", "Dementia Support Specialist", "First Aid & CPR"],
    services: ["Elderly Companionship", "Dementia & Alzheimer Care", "Medication & Vitals Tracking"],
    specializations: ["Certified Nursing Assistant (CNA)", "Dementia Specialist"],
    isPremium: true,
    rating: 4.9,
    reviewCount: 28,
    city: "Munich",
    availability: [1, 2, 3, 4, 5] // Mon-Fri
  },
  {
    id: "44444444-4444-4444-4444-444444444442",
    email: "marcus.k@carenest.ch",
    firstName: "Marcus",
    lastName: "Keller",
    dateOfBirth: "1988-11-22",
    bio: "Registered Geriatric Nurse with over 10 years of experience. Expert in medication tracking, vitals monitoring, and complex physical transfer assistance. Fluent in German and English.",
    gender: "Male",
    experienceYears: 10,
    hourlyRate: 55.00,
    currency: "EUR",
    languages: ["German", "English"],
    certifications: ["Registered Nurse (RN)", "Advanced Life Support (ALS)", "Kinesthetics Trainer"],
    services: ["Mobility & Transfer Assistance", "Medication & Vitals Tracking", "Personal Hygiene & Grooming"],
    specializations: ["Registered Nurse (RN)"],
    isPremium: true,
    rating: 5.0,
    reviewCount: 42,
    city: "Zurich",
    availability: [1, 3, 5] // Mon, Wed, Fri
  },
  {
    id: "44444444-4444-4444-4444-444444444443",
    email: "sophie.m@carenest.fr",
    firstName: "Sophie",
    lastName: "Martin",
    dateOfBirth: "1995-07-03",
    bio: "Compassionate care companion focusing on elderly support, meal preparation, nutrition tracking, and cognitive activities. Active driver with clean record.",
    gender: "Female",
    experienceYears: 4,
    hourlyRate: 35.00,
    currency: "EUR",
    languages: ["French", "English", "German"],
    certifications: ["Nutritional Specialist Certificate", "First Aid & CPR"],
    services: ["Elderly Companionship", "Meal Preparation & Nutrition"],
    specializations: ["Nutritional Specialist"],
    isPremium: false,
    rating: 4.7,
    reviewCount: 15,
    city: "Berlin",
    availability: [2, 4, 6] // Tue, Thu, Sat
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    email: "anna.l@carenest.de",
    firstName: "Anna",
    lastName: "Lieber",
    dateOfBirth: "1994-09-15",
    bio: "Dedicated caregiver companion providing personal hygiene, grooming assistance, and light housekeeping. Dedicated to building strong personal connections with clients.",
    gender: "Female",
    experienceYears: 5,
    hourlyRate: 38.00,
    currency: "EUR",
    languages: ["German", "English"],
    certifications: ["Social Care Worker License", "CPR"],
    services: ["Elderly Companionship", "Personal Hygiene & Grooming"],
    specializations: [],
    isPremium: false,
    rating: 4.8,
    reviewCount: 19,
    city: "Munich",
    availability: [1, 2, 3, 4] // Mon-Thu
  },
  {
    id: "44444444-4444-4444-4444-444444444445",
    email: "thomas.b@carenest.at",
    firstName: "Thomas",
    lastName: "Bauer",
    dateOfBirth: "1990-02-28",
    bio: "Geriatric care assistant with a background in hospice and palliative support. Highly trained in emotional companionship, medical coordination, and overnight monitoring.",
    gender: "Male",
    experienceYears: 7,
    hourlyRate: 48.00,
    currency: "EUR",
    languages: ["German", "English"],
    certifications: ["Hospice Support Specialist", "Medication Management Certificate"],
    services: ["Medication & Vitals Tracking", "Dementia & Alzheimer Care"],
    specializations: ["Hospice & Palliative Care", "Dementia Specialist"],
    isPremium: false,
    rating: 4.9,
    reviewCount: 22,
    city: "Zurich",
    availability: [0, 5, 6] // Sun, Fri, Sat
  }
];

async function seed() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log("Adding 'city' column to CaregiverProfile if missing...");
    await client.query(`
      ALTER TABLE public."CaregiverProfile" 
      ADD COLUMN IF NOT EXISTS city TEXT;
    `);

    console.log("Seeding CaregiverProfiles...");

    console.log("Seeding CaregiverProfiles...");
    for (const cg of caregiversToSeed) {
      // Insert Auth user (mock row in auth.users is bypassed since we are seeding directly to CaregiverProfile for demo)
      // Note: We insert directly into CaregiverProfile.
      await client.query(`
        INSERT INTO public."CaregiverProfile" (
          id, email, "firstName", "lastName", "dateOfBirth", bio, gender, 
          "experienceYears", "hourlyRate", currency, languages, certifications, 
          services, specializations, "availabilityStatus", "verificationStatus", 
          "verificationFeePaid", "isPremium", rating, "reviewCount", "stepsCompleted", city
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
        ) ON CONFLICT (id) DO NOTHING
      `, [
        cg.id, cg.email, cg.firstName, cg.lastName, cg.dateOfBirth, cg.bio, cg.gender,
        cg.experienceYears, cg.hourlyRate, cg.currency, cg.languages, cg.certifications,
        cg.services, cg.specializations, "AVAILABLE", "APPROVED", true, cg.isPremium,
        cg.rating, cg.reviewCount, 3, cg.city
      ]);

      // Seed Availability
      for (const day of cg.availability) {
        await client.query(`
          INSERT INTO public."Availability" (
            "caregiverId", "dayOfWeek", "startTime", "endTime"
          ) VALUES ($1, $2, $3, $4)
        `, [cg.id, day, "08:00", "18:00"]);
      }
    }

    console.log("Seeding caregivers completed successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await client.end();
  }
}

seed();
