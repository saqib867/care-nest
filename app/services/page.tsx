"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useServices } from "@/app/hook/useServices";
import { ServiceItem } from "@/app/actions/services";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { ServiceDetailModal } from "@/components/services/ServiceDetailModal";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const { data: services = [], isLoading, error } = useServices();

  const filteredServices = services.filter((srv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      srv.name.toLowerCase().includes(q) ||
      srv.content.toLowerCase().includes(q) ||
      srv.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col text-slate-900">
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Header */}
      <ServicesHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalServices={filteredServices.length}
      />

      {/* Main Grid Content */}
      <main className="flex-1 py-12 md:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 space-y-8">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-xs font-semibold text-red-600 max-w-md mx-auto">
              Notice: Using cached fallback services. ({error instanceof Error ? error.message : String(error)})
            </div>
          )}

          <ServicesGrid
            services={filteredServices}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onResetSearch={() => setSearchQuery("")}
            onSelectService={(srv) => setSelectedService(srv)}
          />
        </div>
      </main>

      {/* Interactive Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
