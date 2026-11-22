"use client";

import { FamilyDashboardHeader } from "./family/FamilyDashboardHeader";
import { FamilyStats } from "./family/FamilyStats";
import { CurrentShiftRequests } from "./family/CurrentShiftRequests";
import { PastShiftLog } from "./family/PastShiftLog";
import { FamilyPricingInfo } from "./family/FamilyPricingInfo";

export default function FamilyDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <FamilyDashboardHeader />

      <FamilyStats />

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <CurrentShiftRequests />
          {/* <PastShiftLog /> */}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <FamilyPricingInfo />
        </div>
      </div>
    </div>
  );
}
