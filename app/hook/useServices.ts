import { useQuery } from "@tanstack/react-query";
import { getServices, ServiceItem } from "@/app/actions/services";

export function useServices() {
  return useQuery<ServiceItem[]>({
    queryKey: ["services-list"],
    queryFn: async () => {
      const res = await getServices();
      if (!res.success) {
        throw new Error("Failed to load services.");
      }
      return res.services || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
