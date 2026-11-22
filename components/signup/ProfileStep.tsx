"use client";

import { useSignupStore } from "./useSignupStore";
import {
  completeFamilyProfile,
  completeCaregiverProfile,
} from "@/app/actions/auth";
import { uploadFiles } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Globe,
  MapPin,
  Award,
  UploadCloud,
  X,
  FileText,
} from "lucide-react";

export function ProfileStep() {
  const store = useSignupStore();
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isPending = isLoading || !!uploadStatus;

  // Local state helper for languages
  const [langsInput, setLangsInput] = useState(store.languages.join(", "));

  // Storage files state (max 5)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError("");

    const newFiles = Array.from(e.target.files);

    if (selectedFiles.length + newFiles.length > 5) {
      setError("You can upload a maximum of 5 certification documents.");
      return;
    }

    // Validate size (max 5MB) and type
    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the 5MB size limit.`);
        return;
      }
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUploadStatus("");

    // Date of Birth validation (minimum 18 years old)
    if (!store.dateOfBirth) {
      setError("Date of birth is required.");
      return;
    }

    const dobDate = new Date(store.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dobDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      setError("You must be at least 18 years old to join CareNest.");
      return;
    }

    if (store.role === "FAMILY") {
      if (
        !store.city.trim() ||
        !store.country.trim() ||
        !store.postalCode.trim()
      ) {
        setError("City, Country, and Postal Code are required.");
        return;
      }
    } else {
      if (!store.bio.trim() || !store.hourlyRate || !store.experienceYears) {
        setError(
          "Hourly rate, experience, and bio professional statement are required.",
        );
        return;
      }
      if (selectedFiles.length === 0) {
        setError(
          "Please upload at least one certification document (e.g. CPR, Care License).",
        );
        return;
      }
    }

    // Trigger uploads and mutation execution
    try {
      let uploadedUrls: string[] = [];

      // Upload caregiver documents to Supabase Storage
      if (store.role === "CAREGIVER" && selectedFiles.length > 0) {
        uploadedUrls = await uploadFiles(selectedFiles, setUploadStatus);
      }

      // 2. Prepare FormData Payload for the Server Action
      const payload = new FormData();
      payload.append("dateOfBirth", store.dateOfBirth);

      const cleanLangs = langsInput
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean)
        .join(",");
      payload.append("languages", cleanLangs);

      if (store.role === "FAMILY") {
        payload.append("address", store.address);
        payload.append("city", store.city);
        payload.append("country", store.country);
        payload.append("postalCode", store.postalCode);
      } else {
        payload.append("bio", store.bio);
        payload.append("gender", store.gender);
        payload.append("experienceYears", String(store.experienceYears));
        payload.append("hourlyRate", String(store.hourlyRate));
        payload.append("currency", store.currency);
        payload.append("certifications", uploadedUrls.join(","));
        payload.append("availability", JSON.stringify(store.availability));
      }

      setIsLoading(true);

      // 3. Invoke step-specific finalize Server Action
      const response =
        store.role === "FAMILY"
          ? await completeFamilyProfile(store.userId, payload)
          : await completeCaregiverProfile(store.userId, payload);

      if (!response.success) {
        setError(
          response.error || "An onboarding database write error occurred.",
        );
        setUploadStatus("");
      } else {
        setUploadStatus("");
        const redirectRole = store.role === "FAMILY" ? "family" : "caregiver";
        router.push(`/dashboard?role=${redirectRole}`);
        store.resetForm();
      }
    } catch (err: any) {
      console.error("Submit flow caught error:", err);
      setError(
        err.message || "An unexpected error occurred during onboarding.",
      );
      setUploadStatus("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          {store.role === "FAMILY"
            ? "Home Location Details"
            : "Professional Care Profile"}
        </h2>
        <p className="text-sm text-gray-500">
          Complete the final step to finalize your CareNest registration.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {uploadStatus && (
        <div className="bg-secondary/10 text-secondary text-xs font-bold p-3 rounded-xl border border-secondary/20 flex items-center gap-2">
          <Loader2 className="size-3.5 animate-spin" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {store.role === "FAMILY" ? (
        // FAMILY FORM
        <div className="space-y-4">
          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Date of Birth
            </label>
            <input
              type="date"
              required
              value={store.dateOfBirth}
              onChange={(e) => store.updateField("dateOfBirth", e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Street Address (Optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="text"
                placeholder="Friedrichstraße 12"
                value={store.address}
                onChange={(e) => store.updateField("address", e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                City
              </label>
              <input
                type="text"
                required
                placeholder="Munich"
                value={store.city}
                onChange={(e) => store.updateField("city", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Postal Code
              </label>
              <input
                type="text"
                required
                placeholder="80331"
                value={store.postalCode}
                onChange={(e) =>
                  store.updateField("postalCode", e.target.value)
                }
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Country
              </label>
              <input
                type="text"
                required
                placeholder="Germany"
                value={store.country}
                onChange={(e) => store.updateField("country", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Language
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                <select
                  value={store.preferredLanguage || "de"}
                  onChange={(e) =>
                    store.updateField("preferredLanguage", e.target.value)
                  }
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all appearance-none"
                >
                  <option value="de">Deutsch (German)</option>
                  <option value="en">English</option>
                  <option value="fr">Français (French)</option>
                  <option value="it">Italiano</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // CAREGIVER FORM
        <div className="space-y-4">
          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Date of Birth
            </label>
            <input
              type="date"
              required
              value={store.dateOfBirth}
              onChange={(e) => store.updateField("dateOfBirth", e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none transition-all"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Hourly Rate */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                required
                min="10"
                value={store.hourlyRate}
                onChange={(e) =>
                  store.updateField("hourlyRate", Number(e.target.value))
                }
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none transition-all"
              />
            </div>

            {/* Experience Years */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Experience (Yrs)
              </label>
              <input
                type="number"
                required
                min="0"
                value={store.experienceYears}
                onChange={(e) =>
                  store.updateField("experienceYears", Number(e.target.value))
                }
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none transition-all"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Gender
              </label>
              <select
                value={store.gender}
                onChange={(e) => store.updateField("gender", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none transition-all appearance-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Languages (Comma separated)
            </label>
            <input
              type="text"
              placeholder="English, German, French"
              value={langsInput}
              onChange={(e) => setLangsInput(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none transition-all"
            />
          </div>

          {/* Supabase Storage Certifications Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Upload Certifications (Max 5, Required)
            </label>

            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 hover:border-secondary/40 transition-colors flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer relative group">
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                disabled={selectedFiles.length >= 5}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <UploadCloud className="size-8 text-gray-400 group-hover:text-secondary transition-colors mb-2" />
              <p className="text-xs font-bold text-gray-700">
                Click to upload files
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Accepts PDF, PNG, JPG (Max 5MB each)
              </p>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Selected Documents ({selectedFiles.length}/5)
                </p>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl bg-white overflow-hidden">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="size-4 text-secondary shrink-0" />
                        <span className="font-medium text-gray-700 truncate">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Weekly Availability Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
              Weekly Availability & Hours
            </label>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
              {[
                { name: "Sunday", id: 0 },
                { name: "Monday", id: 1 },
                { name: "Tuesday", id: 2 },
                { name: "Wednesday", id: 3 },
                { name: "Thursday", id: 4 },
                { name: "Friday", id: 5 },
                { name: "Saturday", id: 6 },
              ].map((day) => {
                const activeSlot = store.availability.find((av) => av.day === day.id);
                const isChecked = !!activeSlot;

                const handleCheckboxChange = (checked: boolean) => {
                  if (checked) {
                    // Add day with default hours
                    store.updateField("availability", [
                      ...store.availability,
                      { day: day.id, startTime: "09:00", endTime: "17:00" },
                    ]);
                  } else {
                    // Remove day
                    store.updateField(
                      "availability",
                      store.availability.filter((av) => av.day !== day.id)
                    );
                  }
                };

                const handleTimeChange = (type: "startTime" | "endTime", val: string) => {
                  store.updateField(
                    "availability",
                    store.availability.map((av) =>
                      av.day === day.id ? { ...av, [type]: val } : av
                    )
                  );
                };

                return (
                  <div
                    key={day.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 text-sm hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        id={`avail-day-${day.id}`}
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                        className="rounded border-gray-300 text-secondary focus:ring-secondary size-4 cursor-pointer"
                      />
                      <label
                        htmlFor={`avail-day-${day.id}`}
                        className={`font-semibold cursor-pointer select-none ${
                          isChecked ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {day.name}
                      </label>
                    </div>

                    {isChecked && activeSlot ? (
                      <div className="flex items-center gap-2 animate-in fade-in duration-200">
                        <input
                          type="time"
                          value={activeSlot.startTime}
                          onChange={(e) => handleTimeChange("startTime", e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-medium"
                        />
                        <span className="text-gray-400 text-xs">to</span>
                        <input
                          type="time"
                          value={activeSlot.endTime}
                          onChange={(e) => handleTimeChange("endTime", e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-medium"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic sm:pr-8">
                        Unavailable
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Professional Bio
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe your credentials, personal care philosophy, and home care expertise..."
              value={store.bio}
              onChange={(e) => store.updateField("bio", e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none transition-all resize-none"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          disabled={isPending}
          onClick={store.prevStep}
          className="flex-1 h-11 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
        >
          Go Back
        </button>
        <button
          type="submit"
          disabled={isPending}
          className={`flex-1 h-11 font-semibold rounded-xl text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
            store.role === "CAREGIVER"
              ? "bg-secondary hover:bg-secondary/95 shadow-secondary/10"
              : "bg-primary hover:bg-primary/95 shadow-primary/10"
          } disabled:opacity-80`}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Submit & Onboard</span>
          )}
        </button>
      </div>
    </form>
  );
}
