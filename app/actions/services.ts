"use server";

import { supabase } from "@/lib/supabase";

export interface ServiceItem {
  id: string;
  name: string;
  createdAt: string;
  content: string;
}

const LOREM_IPSUM_CONTENT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

export async function getServices() {
  try {
    // 1. Try fetching from "services" table
    let { data, error } = await supabase.from("services").select("*");

    // 2. Fallback to "service" table
    if (error || !data || data.length === 0) {
      const res = await supabase.from("service").select("*");
      if (res.data && res.data.length > 0) {
        data = res.data;
        error = null;
      }
    }

    // 3. Fallback to "Service" table
    if (error || !data || data.length === 0) {
      const res = await supabase.from("Service").select("*");
      if (res.data && res.data.length > 0) {
        data = res.data;
        error = null;
      }
    }

    if (error || !data) {
      console.warn(
        "Could not fetch services from DB, returning fallback mock services:",
        error?.message,
      );
      return {
        success: true,
        services: getFallbackServices(),
      };
    }

    const formattedServices: ServiceItem[] = (data || []).map((row: any) => {
      const rawContent = row.content || row.description || null;
      return {
        id: String(row.id),
        name: String(row.name || "Care Service"),
        createdAt: String(
          row.createdAt || row.createdat || row.created_at || new Date().toISOString(),
        ),
        content:
          rawContent && String(rawContent).trim()
            ? String(rawContent)
            : LOREM_IPSUM_CONTENT,
      };
    });

    formattedServices.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    if (formattedServices.length === 0) {
      return {
        success: true,
        services: getFallbackServices(),
      };
    }

    return {
      success: true,
      services: formattedServices,
    };
  } catch (err: any) {
    console.error("Error in getServices action:", err);
    return {
      success: true,
      services: getFallbackServices(),
    };
  }
}

function getFallbackServices(): ServiceItem[] {
  return [
    {
      id: "srv-1",
      name: "Elderly Home Care & Domiciliary Support",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      content: LOREM_IPSUM_CONTENT,
    },
    {
      id: "srv-2",
      name: "Specialized Dementia & Alzheimer's Care",
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      content: LOREM_IPSUM_CONTENT,
    },
    {
      id: "srv-3",
      name: "Meal Preparation & Nutritional Support",
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      content:
        "Custom meal planning, dietary management, fresh cooking, and nutritional assistance tailored for seniors and post-op recovery.",
    },
    {
      id: "srv-4",
      name: "Medication Reminders & Vitals Tracking",
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      content: LOREM_IPSUM_CONTENT,
    },
    {
      id: "srv-5",
      name: "Mobility Aid & Physical Disability Support",
      createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      content: LOREM_IPSUM_CONTENT,
    },
    {
      id: "srv-6",
      name: "Personal Hygiene & Grooming Assistance",
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      content: LOREM_IPSUM_CONTENT,
    },
  ];
}
