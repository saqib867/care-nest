"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AboutTab } from "./tabs/AboutTab";
import { CredentialsTab } from "./tabs/CredentialsTab";
import { ReviewsTab } from "./tabs/ReviewsTab";

export type CaregiverTabType = "about" | "credentials" | "reviews";

interface CaregiverTabsProps {
  cg: any;
}

export function CaregiverTabs({ cg }: CaregiverTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get("tab") as CaregiverTabType) || "about";

  const handleTabChange = (tab: CaregiverTabType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const tabs: { id: CaregiverTabType; label: string }[] = [
    { id: "about", label: "About" },
    { id: "credentials", label: "Credentials" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="space-y-6">
      {/* TAB HEADER */}
      <div className="flex border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className={`px-6 py-3 text-sm font-bold border-b-2 capitalize transition-colors cursor-pointer ${
              activeTab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
        {activeTab === "about" && <AboutTab cg={cg} />}
        {activeTab === "credentials" && <CredentialsTab cg={cg} />}
        {activeTab === "reviews" && <ReviewsTab cg={cg} />}
      </div>
    </div>
  );
}
