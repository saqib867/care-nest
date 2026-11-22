"use client";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FilterSection from "@/components/landing/FilterSection";
import FeaturedCaregivers from "@/components/landing/FeaturedCaregivers";
import HowItWorks from "@/components/landing/HowItWorks";
import PlatformFeatures from "@/components/landing/PlatformFeatures";
import Footer from "@/components/landing/Footer";
import { useMe } from "./hook/useMe";

import { collection, getDocs } from "firebase/firestore";
import { jsPDF } from "jspdf";
import { db } from "@/lib/firebase";

export const exportDuplicateLandmarkNamesToPDF = async () => {
  try {
    const snapshot = await getDocs(collection(db, "land_marks"));

    if (snapshot.empty) {
      console.log("No landmarks found.");
      return;
    }

    // Count occurrences of each english_name
    const nameCounts: Record<string, number> = {};

    snapshot.docs.forEach((doc) => {
      const englishName = doc.data()?.english_name;

      if (englishName) {
        const name = englishName;

        nameCounts[name] = (nameCounts[name] || 0) + 1;
      }
    });

    // Keep only duplicates
    const duplicates = Object.entries(nameCounts)
      .filter(([_, count]) => count > 1)
      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB));

    if (duplicates.length === 0) {
      console.log("No duplicate landmark names found.");
      return;
    }

    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("Duplicate Landmark Names", 20, 20);

    pdf.setFontSize(10);

    let y = 30;

    duplicates.forEach(([name, count], index) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(`${index + 1}. ${name} (${count} times)`, 20, y);

      y += 7;
    });

    pdf.save("duplicate-landmark-names.pdf");

    console.log(`Found ${duplicates.length} duplicate landmark names.`);
  } catch (error) {
    console.error("Error exporting duplicate landmarks:", error);
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col justify-between">
      <div>
        {/* Header / Navbar */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* <button
          onClick={exportDuplicateLandmarkNamesToPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4"
        >
          Export Duplicate Landmark Names to PDF
        </button> */}

        {/* Filter Section */}
        {/* <FilterSection /> */}

        {/* Featured Caregivers Section */}
        <FeaturedCaregivers />

        {/* How it Works Section */}
        <HowItWorks />

        {/* Platform Features Section */}
        <PlatformFeatures />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
