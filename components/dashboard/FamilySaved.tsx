import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDashboardStore } from "@/app/hook/useDashboardStore";

export default function FamilySaved() {
  const favorites = useDashboardStore((state) => state.favorites);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Saved Caregivers</h1>
        <p className="text-xs text-gray-500 mt-1">Quick-access directory of your favorite verified home care companions.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-xl shadow-gray-100/40">
          <Heart className="size-12 text-gray-200 mx-auto mb-3" />
          <p className="text-xs text-gray-400">You haven't saved any caregivers yet. Start searching in the Find Caregivers directory!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((cg) => (
            <div key={cg.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40 relative flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl overflow-hidden relative shrink-0 border border-gray-100">
                  <Image src={cg.avatar} alt={cg.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">{cg.name}</h3>
                  <p className="text-[10px] text-gray-400">{cg.certifications.slice(0, 2).join(" • ") || "Verified Care Companion"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-gray-55 pt-3">
                <span className="flex items-center gap-0.5 text-amber-500 font-bold"><Star className="size-3.5 fill-current" /> {cg.rating || "5.0"}</span>
                <span className="font-black text-primary">${cg.hourlyRate} / hr</span>
              </div>

              <Link 
                href={`/search`}
                className="w-full inline-flex h-8 items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors text-xs font-bold"
              >
                Book Companion
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
