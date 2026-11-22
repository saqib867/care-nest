"use client";

import {
  Heart,
  LayoutDashboard,
  Search,
  ClipboardList,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  Calendar,
  Euro,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMe, useLogout } from "@/app/hook/useMe";
import { useDashboardStore } from "@/app/hook/useDashboardStore";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: me } = useMe();
  const logout = useLogout();
  const { setRole, role: storeRole, dbRole: storeDbRole } = useDashboardStore();

  const handleLogout = (customRouter?: any) => logout(customRouter || router);

  const role = me?.isCaregiver
    ? "caregiver"
    : me?.isFamily
      ? "family"
      : storeRole;

  const dbRole = me?.role || storeDbRole;

  const userName =
    me?.firstName || me?.lastName
      ? `${me.firstName || ""} ${me.lastName || ""}`.trim()
      : "User";

  const isActive = (path: string) => pathname === path;

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between border-gray-100 px-6 shrink-0 sticky top-0 z-30 shadow-sm shadow-gray-100/10">
      {/* Left side: Logo & Navigation */}

      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 group shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
          <Heart className="size-4.5 fill-current" />
        </div>
        <span className="text-lg font-bold tracking-tight text-primary">
          Care<span className="text-secondary font-semibold">Nest</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-1">
        {role === "family" ? (
          /* --- FAMILY PORTAL NAV --- */
          <>
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive("/dashboard")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/search"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive("/search")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Search className="size-4" />
              <span>Find Caregivers</span>
            </Link>

            <Link
              href="/dashboard/bookings"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive("/dashboard/bookings")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ClipboardList className="size-4" />
              <span>My Bookings</span>
            </Link>

            {/* <Link
              href="/dashboard/saved"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive("/dashboard/saved")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Heart className="size-4" />
              <span>Saved Caregivers</span>
            </Link> */}

            <Link
              href="/dashboard/messages"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive("/dashboard/messages")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="size-4" />
              <span>Messages</span>
            </Link>
          </>
        ) : (
          /* --- CAREGIVER PORTAL NAV --- */
          <>
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive("/dashboard")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/bookings"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive("/dashboard/bookings")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ClipboardList className="size-4" />
              <span>Bookings</span>
            </Link>

            {/* <Link
              href="/dashboard/calendar"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive("/dashboard/calendar")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Calendar className="size-4" />
              <span>Calendar</span>
            </Link> */}

            <Link
              href="/dashboard/messages"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive("/dashboard/messages")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="size-4" />
              <span>Messages</span>
            </Link>

            <Link
              href="/dashboard/earnings"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive("/dashboard/earnings")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Euro className="size-4" />
              <span>Earnings</span>
            </Link>
          </>
        )}
      </nav>

      {/* Right side: Session Portal Switcher & Avatar Action Menu */}
      <div className="flex items-center gap-4">
        {/* Portal switcher details */}
        {dbRole ? (
          <div className="hidden lg:flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                dbRole === "CAREGIVER"
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/10 text-secondary"
              }`}
            >
              {dbRole === "CAREGIVER" ? (
                <ShieldCheck className="size-3" />
              ) : (
                <User className="size-3" />
              )}
              <span>
                {dbRole === "CAREGIVER" ? "Caregiver Portal" : "Family Portal"}
              </span>
            </span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Portal Switcher
            </span>
            <div className="flex bg-gray-100 rounded-full p-0.5 border border-gray-200">
              <button
                onClick={() => {
                  setRole("family");
                  router.push("/dashboard");
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  role === "family"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-950"
                }`}
              >
                <User className="size-3" />
                <span>Family View</span>
              </button>
              <button
                onClick={() => {
                  setRole("caregiver");
                  router.push("/dashboard");
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  role === "caregiver"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-950"
                }`}
              >
                <ShieldCheck className="size-3" />
                <span>Caregiver View</span>
              </button>
            </div>
          </div>
        )}

        {/* User avatar menu using shadcn popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="size-9 rounded-full overflow-hidden relative shrink-0 border border-gray-200 bg-primary/10 hover:bg-primary/15 flex items-center justify-center font-bold text-primary text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 p-2 rounded-2xl border border-gray-100 shadow-2xl bg-white animate-in fade-in slide-in-from-top-2"
            align="end"
          >
            <div className="px-3 py-2 mb-1 border-b border-gray-50">
              <p className="text-xs font-extrabold text-gray-900 truncate">
                {userName || "User Session"}
              </p>
              <p className="text-[9px] text-gray-400 truncate uppercase mt-0.5">
                {role} Portal
              </p>
            </div>

            <div className="space-y-0.5">
              <Link
                href="/dashboard/profile"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <User className="size-4 text-gray-400" />
                <span>Profile</span>
              </Link>

              {/* <Link
                href="/dashboard/settings"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Settings className="size-4 text-gray-400" />
                <span>Settings</span>
              </Link> */}

              <Link
                href="/dashboard/help"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <HelpCircle className="size-4 text-gray-400" />
                <span>Help</span>
              </Link>
            </div>

            <hr className="border-gray-100 my-1.5" />

            <button
              onClick={() => handleLogout(router)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-colors text-left font-sans"
            >
              <LogOut className="size-4" />
              <span>Log Out</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
