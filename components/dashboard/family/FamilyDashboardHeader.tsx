import Link from "next/link";
import { Plus } from "lucide-react";

export function FamilyDashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Family Care Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Manage scheduled caregivers, verify shift timesheets, and view historical bookings.
        </p>
      </div>
      <Link 
        href="/search"
        className="inline-flex h-10 items-center justify-center rounded-xl bg-primary text-white px-5 text-xs font-bold hover:bg-primary/95 transition-all gap-1.5 shadow-md active:scale-95 cursor-pointer"
      >
        <Plus className="size-4" /> Find New Caregiver
      </Link>
    </div>
  );
}
