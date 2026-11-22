"use client";

import { useState, useEffect } from "react";
import { format, parse, parseISO, isValid } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Sparkles,
  Check,
  Heart,
  ShieldCheck,
  FileText,
  ChevronRight,
  Info,
  DollarSign,
} from "lucide-react";
import { useModalStore } from "./useModalStore";
import { supabase } from "@/lib/supabase";
import {
  getOrCreateConversation,
  sendCareRequest,
  sendMessage,
} from "@/app/actions/messages";

const CARE_NEEDS_OPTIONS = [
  "Personal Care",
  "Companionship",
  "Meal Preparation",
  "Medication Reminder",
  "Mobility Assistance",
  "Light Housekeeping",
  "Transportation",
  "Dementia Support",
  "Overnight Care",
  "Shopping Assistance",
  "Other",
];

export function RequestCareModal() {
  const router = useRouter();
  const { isOpen, type, data, closeModal } = useModalStore();
  const cg = data.caregiver;

  // Form States
  const [careType, setCareType] = useState<
    "One-time" | "Recurring" | "Live-in"
  >("One-time");

  // Schedule - One-time
  const [oneTimeDate, setOneTimeDate] = useState("");
  const [oneTimeTime, setOneTimeTime] = useState("09:00");
  const [oneTimeDuration, setOneTimeDuration] = useState("4 Hours");

  // Schedule - Recurring
  const [recStartDate, setRecStartDate] = useState("");
  const [recEndDate, setRecEndDate] = useState("");
  const [recTime, setRecTime] = useState("09:00");
  const [recDuration, setRecDuration] = useState("4 Hours");
  const [recDays, setRecDays] = useState<string[]>([]);

  // Schedule - Live-in
  const [liveInMoveInDate, setLiveInMoveInDate] = useState("");
  const [liveInStay, setLiveInStay] = useState("1 Month");
  const [liveInCustomEndDate, setLiveInCustomEndDate] = useState("");

  // Location
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Munich");
  const [postalCode, setPostalCode] = useState("");
  const [aptNumber, setAptNumber] = useState("");
  const [parkingInfo, setParkingInfo] = useState("");
  const [doorbellName, setDoorbellName] = useState("");

  // Recipient
  const [recipientName, setRecipientName] = useState("");
  const [recipientAge, setRecipientAge] = useState("");
  const [recipientGender, setRecipientGender] = useState("Female");
  const [recipientRelationship, setRecipientRelationship] = useState("Mother");

  // Care Needs
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [customCareNeed, setCustomCareNeed] = useState("");

  // Additional Information
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");

  // UI Flow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load default address details if user is signed in
  useEffect(() => {
    if (!isOpen) return;
    async function loadFamilyDetails() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("FamilyProfile")
          .select("address, city, postalCode")
          .eq("id", user.id)
          .maybeSingle();
        if (profile) {
          setAddress(profile.address || "");
          setCity(profile.city || "Munich");
          setPostalCode(profile.postalCode || "");
        }
      }
    }
    loadFamilyDetails();
  }, [isOpen]);

  if (!isOpen || type !== "requestCare" || !cg) return null;

  // Toggle Care Need chip
  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need],
    );
  };

  // Toggle Weekday Selection
  const toggleDay = (day: string) => {
    setRecDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  // Compile Schedule Summary Text
  const formatDateStr = (dateStr: string, formatPattern = "MMM d, yyyy") => {
    if (!dateStr) return "";
    try {
      const parsed = parseISO(dateStr);
      return isValid(parsed) ? format(parsed, formatPattern) : dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatTimeStr = (timeStr: string) => {
    if (!timeStr) return "";
    try {
      const parsed = parse(timeStr, "HH:mm", new Date());
      return isValid(parsed) ? format(parsed, "h:mm a") : timeStr;
    } catch {
      return timeStr;
    }
  };

  const getScheduleSummary = () => {
    if (careType === "One-time") {
      const formattedDate = oneTimeDate
        ? formatDateStr(oneTimeDate, "EEE, MMM d, yyyy")
        : "Select Date";
      const formattedTime = formatTimeStr(oneTimeTime);
      return `${formattedDate} at ${formattedTime} (${oneTimeDuration})`;
    } else if (careType === "Recurring") {
      const formattedStart = recStartDate
        ? formatDateStr(recStartDate, "MMM d, yyyy")
        : "Select Start Date";
      const formattedEnd = recEndDate
        ? formatDateStr(recEndDate, "MMM d, yyyy")
        : "Select End Date";
      const formattedTime = formatTimeStr(recTime);
      const daysStr = recDays.length > 0 ? recDays.join(", ") : "Select Days";
      return `Starts ${formattedStart} to ${formattedEnd}, Repeating: [${daysStr}] at ${formattedTime} (${recDuration}/day)`;
    } else {
      const formattedMoveIn = liveInMoveInDate
        ? formatDateStr(liveInMoveInDate, "MMM d, yyyy")
        : "Select Date";
      const formattedCustomEnd = liveInCustomEndDate
        ? formatDateStr(liveInCustomEndDate, "MMM d, yyyy")
        : "Select End Date";
      const stayText =
        liveInStay === "Custom"
          ? `Custom until ${formattedCustomEnd}`
          : liveInStay;
      return `Live-in moving in ${formattedMoveIn} for ${stayText}`;
    }
  };

  // Compile Duration Text
  const getEstimatedDuration = () => {
    if (careType === "One-time") return oneTimeDuration;
    if (careType === "Recurring") return `${recDuration} daily`;
    return liveInStay === "Custom" ? "Custom Duration" : liveInStay;
  };

  // Handle Form Submit Care Request
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Form Validations
    if (careType === "One-time" && !oneTimeDate) {
      setErrorMsg("Please select a date for the shift.");
      return;
    }
    if (
      careType === "Recurring" &&
      (!recStartDate || !recEndDate || recDays.length === 0)
    ) {
      setErrorMsg("Please fill in start/end dates and select repeating days.");
      return;
    }
    if (careType === "Live-in" && !liveInMoveInDate) {
      setErrorMsg("Please select a move-in date.");
      return;
    }
    if (!address || !city || !postalCode) {
      setErrorMsg("Please fill in the location details.");
      return;
    }
    if (!recipientName || !recipientAge) {
      setErrorMsg("Please specify care recipient name and age.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Get authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to request care.");
      }

      // 2. Establish/Create conversation
      const convRes = await getOrCreateConversation(user.id, cg.id);
      if (!convRes.success || !convRes.conversationId) {
        throw new Error(
          convRes.error || "Failed to establish a conversation channel.",
        );
      }

      const conversationId = convRes.conversationId;

      // 3. Compile explicit timing details based on care type
      const timingDetails =
        careType === "One-time"
          ? {
              date: oneTimeDate,
              formattedDate: formatDateStr(oneTimeDate, "EEE, MMM d, yyyy"),
              time: oneTimeTime,
              formattedTime: formatTimeStr(oneTimeTime),
              duration: oneTimeDuration,
            }
          : careType === "Recurring"
            ? {
                startDate: recStartDate,
                formattedStartDate: formatDateStr(recStartDate, "MMM d, yyyy"),
                endDate: recEndDate,
                formattedEndDate: formatDateStr(recEndDate, "MMM d, yyyy"),
                time: recTime,
                formattedTime: formatTimeStr(recTime),
                duration: recDuration,
                days: recDays,
              }
            : {
                moveInDate: liveInMoveInDate,
                formattedMoveInDate: formatDateStr(
                  liveInMoveInDate,
                  "MMM d, yyyy",
                ),
                stayDuration: liveInStay,
                customEndDate: liveInCustomEndDate,
                formattedCustomEndDate: liveInCustomEndDate
                  ? formatDateStr(liveInCustomEndDate, "MMM d, yyyy")
                  : undefined,
              };

      // 4. Compile structured payload
      const requestPayload = {
        caregiverId: cg.id,
        hourlyRate: Number(cg.hourlyRate || 30),
        careType: `${careType} Care`,
        scheduleSummary: getScheduleSummary(),
        estimatedDuration: getEstimatedDuration(),
        timing: timingDetails,
        // Explicit helper fields
        date: careType === "One-time" ? oneTimeDate : undefined,
        time:
          careType === "One-time"
            ? oneTimeTime
            : careType === "Recurring"
              ? recTime
              : undefined,
        startDate: careType === "Recurring" ? recStartDate : undefined,
        endDate: careType === "Recurring" ? recEndDate : undefined,
        days: careType === "Recurring" ? recDays : undefined,
        moveInDate: careType === "Live-in" ? liveInMoveInDate : undefined,
        stayDuration: careType === "Live-in" ? liveInStay : undefined,
        location: {
          address,
          city,
          postalCode,
          aptNumber,
          parkingInfo,
          doorbellName,
        },
        recipient: {
          name: recipientName,
          age: Number(recipientAge),
          gender: recipientGender,
          relationship: recipientRelationship,
        },
        careNeeds: selectedNeeds,
        additionalInfo,
        personalMessage,
      };

      // 4. Send structured care request message in database
      const reqRes = await sendCareRequest(
        conversationId,
        user.id,
        requestPayload,
      );
      if (!reqRes.success) {
        throw new Error(reqRes.error || "Failed to submit structured request.");
      }

      // 5. Send personal text message if written
      // if (personalMessage.trim()) {
      //   await sendMessage(conversationId, user.id, personalMessage.trim());
      // }

      setIsSuccess(true);
    } catch (err: any) {
      console.log("Submit care request error:", err);
      setErrorMsg(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4 sm:py-10 animate-fade-in">
      {/* Modal Dialog Box */}
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-gray-100 shadow-2xl flex flex-col md:flex-row relative overflow-hidden animate-scale-up">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-30 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Dynamic Success State Panel */}
        {isSuccess ? (
          <div className="w-full p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]">
            <div className="size-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Check className="size-8 stroke-[3]" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-black text-gray-900">
                Your care request has been sent
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                The caregiver {cg.name} will review your request and you'll
                receive a notification once they respond.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full max-w-sm">
              <button
                onClick={() => {
                  closeModal();
                  router.push("/search");
                }}
                className="flex-1 inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
              <button
                onClick={() => {
                  closeModal();
                  if (cg?.id) {
                    router.push(`/dashboard/messages?userId=${cg.id}`);
                  } else {
                    router.push("/dashboard/messages");
                  }
                }}
                className="flex-1 inline-flex h-11 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-md cursor-pointer"
              >
                Go to Conversation
              </button>
            </div>
          </div>
        ) : (
          /* --- EDIT / FILL REQUEST STATE --- */
          <>
            {/* Left Content Area (Scrolling Form) */}
            <div className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[85vh] md:max-h-[680px]">
              {/* Header */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 inline-block">
                  Request Companion Care
                </span>
                <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                  Request Care
                </h2>
                <p className="text-xs text-gray-500 leading-normal">
                  Tell the caregiver about your care needs and preferred
                  schedule.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl text-xs font-semibold text-red-600 leading-normal">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmitRequest} className="space-y-8">
                {/* SECTION 1: Care Type */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Sparkles className="size-4 text-primary" /> Section 1: Care
                    Type
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {/* One-time Care */}
                    <button
                      type="button"
                      onClick={() => setCareType("One-time")}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-32 ${
                        careType === "One-time"
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="size-6 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                        {careType === "One-time" && (
                          <span className="size-3 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900">
                          One-time Care
                        </p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                          Book a caregiver for a single visit.
                        </p>
                      </div>
                    </button>

                    {/* Recurring Care */}
                    <button
                      type="button"
                      onClick={() => setCareType("Recurring")}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-32 ${
                        careType === "Recurring"
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="size-6 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                        {careType === "Recurring" && (
                          <span className="size-3 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900">
                          Recurring Care
                        </p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                          Book a caregiver on a repeating schedule.
                        </p>
                      </div>
                    </button>

                    {/* Live-in Care */}
                    <button
                      type="button"
                      onClick={() => setCareType("Live-in")}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-32 ${
                        careType === "Live-in"
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="size-6 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                        {careType === "Live-in" && (
                          <span className="size-3 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900">
                          Live-in Care
                        </p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                          Caregiver stays for extended periods.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* SECTION 2: Dynamic Schedule */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Calendar className="size-4 text-primary" /> Section 2:
                    Schedule
                  </h3>

                  {/* IF ONE-TIME */}
                  {careType === "One-time" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-500 uppercase">
                            Date
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={oneTimeDate}
                            onChange={(e) => setOneTimeDate(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-500 uppercase">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={oneTimeTime}
                            onChange={(e) => setOneTimeTime(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          Estimated Duration
                        </label>
                        <select
                          value={oneTimeDuration}
                          onChange={(e) => setOneTimeDuration(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary font-medium h-10"
                        >
                          {[
                            "1 Hour",
                            "2 Hours",
                            "3 Hours",
                            "4 Hours",
                            "6 Hours",
                            "8 Hours",
                            "12 Hours",
                          ].map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* IF RECURRING */}
                  {careType === "Recurring" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-500 uppercase">
                            Start Date
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={recStartDate}
                            onChange={(e) => setRecStartDate(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-500 uppercase">
                            End Date
                          </label>
                          <input
                            type="date"
                            min={
                              recStartDate ||
                              new Date().toISOString().split("T")[0]
                            }
                            value={recEndDate}
                            onChange={(e) => setRecEndDate(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                          />
                        </div>
                      </div>

                      {/* Repeating On week selector */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          Repeat On
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ].map((day) => {
                            const isSelected = recDays.includes(day);
                            return (
                              <button
                                type="button"
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`h-9 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-primary text-white"
                                    : "bg-gray-55 border border-gray-100 hover:bg-gray-100 text-gray-600"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-500 uppercase">
                            Preferred Start Time
                          </label>
                          <input
                            type="time"
                            value={recTime}
                            onChange={(e) => setRecTime(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-500 uppercase">
                            Daily Duration
                          </label>
                          <select
                            value={recDuration}
                            onChange={(e) => setRecDuration(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary font-medium h-10"
                          >
                            {[
                              "2 Hours",
                              "4 Hours",
                              "6 Hours",
                              "8 Hours",
                              "12 Hours",
                            ].map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-400 italic">
                        The caregiver will receive a recurring care request for
                        the selected days.
                      </p>
                    </div>
                  )}

                  {/* IF LIVE-IN */}
                  {careType === "Live-in" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-500 uppercase">
                            Move-in Date
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={liveInMoveInDate}
                            onChange={(e) =>
                              setLiveInMoveInDate(e.target.value)
                            }
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-500 uppercase">
                            Expected Stay
                          </label>
                          <select
                            value={liveInStay}
                            onChange={(e) => setLiveInStay(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary font-medium h-10"
                          >
                            {[
                              "1 Week",
                              "2 Weeks",
                              "1 Month",
                              "2 Months",
                              "3 Months",
                              "Custom",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {liveInStay === "Custom" && (
                        <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150">
                          <label className="block text-xs font-bold text-gray-500 uppercase">
                            Expected End Date
                          </label>
                          <input
                            type="date"
                            min={
                              liveInMoveInDate ||
                              new Date().toISOString().split("T")[0]
                            }
                            value={liveInCustomEndDate}
                            onChange={(e) =>
                              setLiveInCustomEndDate(e.target.value)
                            }
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                          />
                        </div>
                      )}

                      <p className="text-[10px] text-gray-400 italic">
                        The caregiver will stay with the care recipient during
                        the selected period.
                      </p>
                    </div>
                  )}
                </div>

                {/* SECTION 3: Location */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <MapPin className="size-4 text-primary" /> Section 3:
                    Location
                  </h3>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Theresienwiese 12"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="80336"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Optional Notes
                      </span>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-gray-400 uppercase">
                            Apartment number
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Apt 3B"
                            value={aptNumber}
                            onChange={(e) => setAptNumber(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[11px] focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-gray-400 uppercase">
                            Parking information
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Guest slot #5"
                            value={parkingInfo}
                            onChange={(e) => setParkingInfo(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[11px] focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-gray-400 uppercase">
                            Doorbell name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Mueller"
                            value={doorbellName}
                            onChange={(e) => setDoorbellName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[11px] focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Care Recipient */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <User className="size-4 text-primary" /> Section 4: Care
                    Recipient
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anna Mueller"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase">
                        Age
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 78"
                        value={recipientAge}
                        onChange={(e) => setRecipientAge(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase">
                        Gender
                      </label>
                      <select
                        value={recipientGender}
                        onChange={(e) => setRecipientGender(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary font-medium h-10"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-binary">Non-binary</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase">
                        Relationship
                      </label>
                      <select
                        value={recipientRelationship}
                        onChange={(e) =>
                          setRecipientRelationship(e.target.value)
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary font-medium h-10"
                      >
                        {[
                          "Mother",
                          "Father",
                          "Grandparent",
                          "Spouse",
                          "Sibling",
                          "Child",
                          "Other",
                        ].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 5: Care Needs */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Heart className="size-4 text-primary" /> Section 5: Care
                    Needs
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {CARE_NEEDS_OPTIONS.map((need) => {
                      const isSelected = selectedNeeds.includes(need);
                      return (
                        <button
                          type="button"
                          key={need}
                          onClick={() => toggleNeed(need)}
                          className={`h-8 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-secondary/15 text-secondary border border-secondary/20"
                              : "bg-gray-50 border border-gray-100 hover:bg-gray-100 text-gray-500"
                          }`}
                        >
                          {need}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 6: Additional Info */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <FileText className="size-4 text-primary" /> Section 6:
                    Additional Information
                  </h3>

                  <textarea
                    rows={4}
                    placeholder="Describe the care recipient's condition, daily routine, special requirements, allergies, or anything the caregiver should know."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                {/* SECTION 7: Personal Message */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Check className="size-4 text-primary" /> Section 7:
                    Personal Message
                  </h3>

                  <textarea
                    rows={4}
                    required
                    placeholder={`Hi ${cg.name.split(" ")[0]},\n\nI'm looking for someone to help my mother three times a week. I believe your experience would be a great fit...`}
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                {/* Sticky footer for mobile buttons */}
                <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3 z-10">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 h-11 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-11 inline-flex items-center justify-center rounded-xl bg-primary text-white text-xs font-bold shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Care Request"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Summary Card (Desktop Only) */}
            <div className="hidden md:flex w-80 bg-gray-50 border-l border-gray-100 p-6 flex-col justify-between shrink-0">
              <div className="space-y-6">
                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-200 pb-3">
                  Request Summary
                </h3>

                {/* Selected Caregiver */}
                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-gray-100">
                  <div className="size-11 rounded-xl overflow-hidden relative border shrink-0 bg-gray-100">
                    <Image
                      src={cg.avatar}
                      alt={cg.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-950">
                      {cg.name}
                    </h4>
                    <p className="text-[10px] text-primary font-black mt-0.5">
                      ${cg.hourlyRate} / hr
                    </p>
                  </div>
                </div>

                {/* Booking stats details list */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Care Type
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {careType} Care
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Schedule Summary
                    </span>
                    <span className="text-xs font-semibold text-gray-600 block leading-normal">
                      {getScheduleSummary()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Estimated Duration
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {getEstimatedDuration()}
                    </span>
                  </div>

                  {(address || city) && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        Location
                      </span>
                      <span className="text-xs font-semibold text-gray-600 block leading-normal">
                        {address}, {city}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                  className="w-full inline-flex h-10 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Sending..." : "Send Care Request"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
