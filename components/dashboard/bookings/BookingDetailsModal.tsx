"use client";

import { useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  MapPin,
  Heart,
  DollarSign,
  Info,
  FileText,
  KeyRound,
  Car,
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  isFamily: boolean;
}

export function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
  isFamily,
}: BookingDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

  const content =
    typeof booking.content === "object" && booking.content !== null
      ? booking.content
      : {};

  const partnerProfile = isFamily
    ? booking.CaregiverProfile
    : booking.FamilyProfile;

  const partnerName = partnerProfile
    ? `${partnerProfile.firstName || ""} ${partnerProfile.lastName || ""}`.trim()
    : isFamily
      ? "Caregiver Partner"
      : "Client Family";

  const careType = booking.careType || content.careType || "One-time Care";
  const estimatedDuration = content.estimatedDuration;
  const scheduleSummary = content.scheduleSummary;
  const recipient = content.recipient;
  const careNeeds: string[] = content.careNeeds || [];
  const location = content.location;
  const additionalInfo = content.additionalInfo;
  const personalMessage = content.personalMessage;

  const timing = content.timing || {
    date: content.date,
    time: content.time,
    startDate: content.startDate,
    endDate: content.endDate,
    days: content.days || content.recDays,
    moveInDate: content.moveInDate,
    stayDuration: content.stayDuration,
    formattedDate: content.formattedDate,
    formattedTime: content.formattedTime,
    formattedStartDate: content.formattedStartDate,
    formattedEndDate: content.formattedEndDate,
    formattedMoveInDate: content.formattedMoveInDate,
    duration: content.duration,
  };

  const rawStart =
    booking.startTime ||
    content.startTime ||
    booking.created_at ||
    booking.createdAt;
  const rawEnd =
    booking.endTime ||
    content.endTime ||
    booking.created_at ||
    booking.createdAt;

  const formatDate = (str: string) => {
    if (!str) return "N/A";
    try {
      const p = parseISO(str);
      return isValid(p) ? format(p, "EEEE, MMMM d, yyyy") : str;
    } catch {
      return str;
    }
  };

  const formatTime = (str: string) => {
    if (!str) return "00:00";
    try {
      const p = parseISO(str);
      return isValid(p) ? format(p, "h:mm a") : str;
    } catch {
      return str;
    }
  };

  const totalAmount = Number(booking.payment || booking.totalAmount || content.payment || content.totalAmount || 0);
  const commissionFee = 0;
  const netAmount = totalAmount;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              <Calendar className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Shift Booking Details
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                ID: {booking.id?.slice(0, 8)}...
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status & Care Type Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Care Category
              </span>
              <span className="text-xs font-black text-slate-900">
                {careType} {estimatedDuration ? `• ${estimatedDuration}` : ""}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                booking.status === "COMPLETED"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : booking.status === "ACCEPTED" ||
                      booking.status === "APPROVED"
                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                    : booking.status === "PENDING"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              {booking.status}
            </span>
          </div>

          {scheduleSummary ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-slate-50 border-l-4 border-l-primary border border-primary/20 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold shadow-2xs">
                  <Clock className="size-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  Requested Schedule Summary
                </span>
              </div>
              <p className="font-black text-slate-900 text-sm leading-relaxed pl-0.5">
                {scheduleSummary}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-slate-50 border-l-4 border-l-primary border border-primary/20 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1">
                  <Calendar className="size-3 text-primary" /> Shift Date
                </span>
                <p className="font-black text-slate-900 text-sm">
                  {formatDate(rawStart)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/10 via-secondary/5 to-slate-50 border-l-4 border-l-secondary border border-secondary/20 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1">
                  <Clock className="size-3 text-secondary" /> Time Window
                </span>
                <p className="font-black text-slate-900 text-sm">
                  {formatTime(rawStart)} - {formatTime(rawEnd)}
                </p>
              </div>
            </div>
          )}

          {/* Explicit Timing Breakdown */}
          {(timing.date || timing.startDate || timing.moveInDate || timing.time) && (
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">
                Explicit Timing Details
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {timing.startDate && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Start Date</span>
                    <p className="font-extrabold text-slate-900">{timing.formattedStartDate || formatDate(timing.startDate)}</p>
                  </div>
                )}

                {timing.endDate && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">End Date</span>
                    <p className="font-extrabold text-slate-900">{timing.formattedEndDate || formatDate(timing.endDate)}</p>
                  </div>
                )}

                {timing.date && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Shift Date</span>
                    <p className="font-extrabold text-slate-900">{timing.formattedDate || formatDate(timing.date)}</p>
                  </div>
                )}

                {timing.moveInDate && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Move-in Date</span>
                    <p className="font-extrabold text-slate-900">{timing.formattedMoveInDate || formatDate(timing.moveInDate)}</p>
                  </div>
                )}

                {timing.time && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Daily Time</span>
                    <p className="font-extrabold text-slate-900">{timing.formattedTime || formatTime(timing.time)}</p>
                  </div>
                )}

                {(timing.duration || estimatedDuration) && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Duration</span>
                    <p className="font-extrabold text-slate-900">{timing.duration || estimatedDuration}</p>
                  </div>
                )}
              </div>

              {timing.days && timing.days.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Repeating Days:</span>
                  <div className="flex flex-wrap gap-1">
                    {timing.days.map((day: string) => (
                      <span key={day} className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Partner Information */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {isFamily ? "Assigned Caregiver" : "Client Family"}
            </p>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                <User className="size-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">
                  {partnerName}
                </p>
                {partnerProfile?.email && (
                  <p className="text-xs text-slate-400 font-medium">
                    {partnerProfile.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Summary / Time Window */}

          {/* Care Recipient Details */}
          {recipient && (
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Heart className="size-3.5 text-rose-500" /> Care Recipient
              </span>
              <div className="flex justify-between items-center text-xs">
                <p className="font-extrabold text-slate-900">
                  {recipient.name}
                </p>
                <span className="text-[11px] font-bold text-slate-500">
                  {recipient.relationship}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {recipient.gender} • {recipient.age} years old
              </p>
            </div>
          )}

          {/* Required Services Badges */}
          {careNeeds && careNeeds.length > 0 && (
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Required Care Services
              </span>
              <div className="flex flex-wrap gap-1.5">
                {careNeeds.map((need) => (
                  <span
                    key={need}
                    className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-primary/10 text-primary border border-primary/20"
                  >
                    {need}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Service Location & Instructions */}
          {location && (
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" /> Service Location
              </span>
              <p className="font-bold text-slate-900">
                {location.address}
                {location.aptNumber ? `, Apt ${location.aptNumber}` : ""}
                <br />
                {location.city}, {location.postalCode}
              </p>

              {(location.parkingInfo || location.doorbellName) && (
                <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                  {location.parkingInfo && (
                    <span className="flex items-center gap-1">
                      <Car className="size-3 text-slate-400" />
                      Parking: {location.parkingInfo}
                    </span>
                  )}
                  {location.doorbellName && (
                    <span className="flex items-center gap-1">
                      <KeyRound className="size-3 text-slate-400" />
                      Buzzer: {location.doorbellName}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Additional Notes & Personal Message */}
          {(additionalInfo || personalMessage) && (
            <div className="p-4 rounded-2xl border-l-4 border-primary bg-slate-50 text-xs space-y-1.5 text-slate-700">
              {additionalInfo && (
                <div>
                  <span className="font-extrabold block text-[10px] text-slate-400 uppercase tracking-wider">
                    Additional Instructions
                  </span>
                  <p className="font-semibold">{additionalInfo}</p>
                </div>
              )}
              {personalMessage && (
                <div>
                  <span className="font-extrabold block text-[10px] text-slate-400 uppercase tracking-wider">
                    Personal Note
                  </span>
                  <p className="italic">"{personalMessage}"</p>
                </div>
              )}
            </div>
          )}

          {/* Financial Breakdown */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <DollarSign className="size-3.5 text-emerald-600" /> Payment
              Breakdown
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Agreed Hourly Rate</span>
                <span className="font-bold text-slate-900">
                  ${(content.hourlyRate || booking.hourlyRate || booking.CaregiverProfile?.hourlyRate) ? Number(content.hourlyRate || booking.hourlyRate || booking.CaregiverProfile?.hourlyRate).toFixed(2) : "30.00"}/hr
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Amount</span>
                <span className="font-bold text-slate-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              {!isFamily && (
                <div className="flex justify-between text-slate-500">
                  <span>Platform Fee (15%)</span>
                  <span className="font-semibold text-rose-600">
                    -${commissionFee.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200/80">
                <span>
                  {isFamily ? "Total Escrow Charged" : "Net Partner Payout"}
                </span>
                <span className="text-primary font-black">
                  ${(isFamily ? totalAmount : netAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
