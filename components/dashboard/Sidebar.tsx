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
  Bell, 
  LogOut 
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMe, useLogout } from "@/app/hook/useMe";
import { useDashboardStore } from "@/app/hook/useDashboardStore";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: me } = useMe();
  const logout = useLogout();
  const { role: storeRole } = useDashboardStore();

  const handleLogout = (customRouter?: any) => logout(customRouter || router);

  const role = me?.isCaregiver
    ? "caregiver"
    : me?.isFamily
      ? "family"
      : storeRole;

  const userName =
    me?.firstName || me?.lastName
      ? `${me.firstName || ""} ${me.lastName || ""}`.trim()
      : "User";

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Helper to determine active state
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 sticky top-0 h-screen z-20">
      <div className="space-y-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <Heart className="size-4.5 fill-current" />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary">
            Care<span className="text-secondary font-semibold">Nest</span>
          </span>
        </Link>

        {/* Role-Specific Navigation Menu */}
        {role === "family" ? (
          /* --- FAMILY MENU --- */
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="size-4.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/search"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              <Search className="size-4.5" />
              <span>Find Caregivers</span>
            </Link>

            <Link
              href="/dashboard/bookings"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/bookings")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ClipboardList className="size-4.5" />
              <span>My Bookings</span>
            </Link>

            <Link
              href="/dashboard/saved"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/saved")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Heart className="size-4.5" />
              <span>Saved Caregivers</span>
            </Link>

            <Link
              href="/dashboard/messages"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/messages")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="size-4.5" />
              <span>Messages</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/profile")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <User className="size-4.5" />
              <span>Profile</span>
            </Link>

            <hr className="border-gray-100 my-4" />

            <Link
              href="/dashboard/settings"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/settings")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Settings className="size-4.5" />
              <span>Settings</span>
            </Link>

            <Link
              href="/dashboard/help"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/help")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <HelpCircle className="size-4.5" />
              <span>Help</span>
            </Link>
          </nav>
        ) : (
          /* --- CAREGIVER MENU --- */
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="size-4.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/bookings"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/bookings")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ClipboardList className="size-4.5" />
              <span>Bookings</span>
            </Link>

            <Link
              href="/dashboard/calendar"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/calendar")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Calendar className="size-4.5" />
              <span>Calendar</span>
            </Link>

            <Link
              href="/dashboard/messages"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/messages")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="size-4.5" />
              <span>Messages</span>
            </Link>

            <Link
              href="/dashboard/earnings"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/earnings")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Euro className="size-4.5" />
              <span>Earnings</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive("/dashboard/profile")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <User className="size-4.5" />
              <span>Profile</span>
            </Link>
          </nav>
        )}
      </div>

      {/* Sidebar Footer (Avatar Menu & Notifications) */}
      <div className="space-y-4 pt-6 border-t border-gray-100 relative">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Quick Actions</span>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors relative cursor-pointer"
          >
            <Bell className="size-4.5" />
            <span className="absolute top-1.5 right-1.5 size-1.5 bg-red-500 rounded-full" />
          </button>
        </div>

        {/* Notifications Dropdown Panel */}
        {showNotifications && (
          <div className="absolute bottom-16 left-2 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 space-y-3 z-30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs font-black text-gray-900">Notifications</span>
              <button onClick={() => setShowNotifications(false)} className="text-[10px] font-bold text-primary hover:underline">Dismiss</button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <div className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg leading-normal">
                <strong>Onboarding successful!</strong> Setup complete.
              </div>
              <div className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg leading-normal">
                <strong>Vetting status</strong>: Active & Approved.
              </div>
            </div>
          </div>
        )}

        {/* Avatar Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors text-left cursor-pointer border border-transparent hover:border-gray-100"
          >
            <div className="size-9 rounded-xl overflow-hidden relative shrink-0 border border-gray-200 bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
              {userName.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-gray-900 truncate">{userName}</p>
              <p className="text-[10px] text-gray-400 truncate uppercase">{role} Portal</p>
            </div>
          </button>

          {/* Avatar menu dropdown */}
          {showAvatarMenu && (
            <div className="absolute bottom-16 right-0 left-0 bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 space-y-1 z-30 animate-in fade-in slide-in-from-bottom-2">
              <Link
                href="/dashboard/profile"
                onClick={() => setShowAvatarMenu(false)}
                className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer text-left"
              >
                <Settings className="size-4 text-gray-400" />
                <span>Settings</span>
              </Link>
              <hr className="border-gray-100 my-1" />
              <button
                onClick={() => handleLogout(router)}
                className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 text-left cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
