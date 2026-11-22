import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadFiles(
  files: File[],
  onProgress?: (status: string) => void
): Promise<string[]> {
  const urls: string[] = [];

  // Optional: Verify the current auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Supabase User:", user);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExt = file.name.split(".").pop()?.toLowerCase();

    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.${fileExt}`;

    // IMPORTANT: Upload to the public folder
    const filePath = `public/${uniqueName}`;

    if (onProgress) {
      onProgress(`Uploading certificate ${i + 1} of ${files.length}...`);
    }

    const { data, error: uploadError } = await supabase.storage
      .from("care-nest")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(
        `Failed to upload ${file.name}: ${uploadError.message}`
      );
    }

    console.log("Upload successful:", data);

    const { data: urlData } = supabase.storage
      .from("care-nest")
      .getPublicUrl(filePath);

    urls.push(urlData.publicUrl);
  }

  return urls;
}