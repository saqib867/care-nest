import { useDashboardStore } from "@/app/hook/useDashboardStore";

export default function CaregiverCalendar() {
  const bookings = useDashboardStore((state) => state.bookings);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Availability & Shifts Calendar</h1>
        <p className="text-xs text-gray-500 mt-1">Calendar overview of all approved home care shifts.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-100/40">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-black text-gray-900">August 2026</span>
            <div className="flex gap-1.5">
              <button className="h-7 w-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-xs cursor-pointer font-bold">&lt;</button>
              <button className="h-7 w-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-xs cursor-pointer font-bold">&gt;</button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const bookingOnDay = bookings.find(b => b.status === "ACCEPTED" && b.dateString === dayStr);
              const hasShift = !!bookingOnDay;

              return (
                <div 
                  key={idx} 
                  className={`h-12 border border-gray-55 rounded-xl flex flex-col justify-between p-1.5 transition-all text-xs font-semibold relative ${
                    hasShift ? "bg-secondary/10 border-secondary ring-1 ring-secondary/25" : "bg-white hover:bg-gray-50/50"
                  }`}
                >
                  <span className={hasShift ? "text-secondary font-black" : "text-gray-400"}>{dayNum}</span>
                  {hasShift && <span className="size-2 bg-secondary rounded-full absolute bottom-1.5 right-1.5" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-100/40 space-y-4">
          <h3 className="font-extrabold text-sm text-gray-900">Scheduled Days</h3>
          <div className="space-y-3">
            {bookings.filter(b => b.status === "ACCEPTED").length === 0 ? (
              <p className="text-xs text-gray-400">No shifts scheduled.</p>
            ) : (
              bookings.filter(b => b.status === "ACCEPTED").map((bk) => (
                <div key={bk.id} className="p-3 border border-secondary/15 bg-secondary/5 rounded-xl space-y-1 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-secondary" />
                  <p className="text-xs font-bold text-gray-900">Shift with {bk.familyName}</p>
                  <p className="text-[10px] text-gray-400">Date: {bk.dateString}</p>
                  <p className="text-[10px] text-gray-400">Time: {bk.startTime} - {bk.endTime}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
