import { useQuery } from "@tanstack/react-query";
import { getApprovedCaregivers, GetApprovedCaregiversParams } from "@/app/actions/caregiver";

export function useFeaturedCaregivers(params?: GetApprovedCaregiversParams) {
  return useQuery({
    queryKey: ["featuredCaregivers", params],
    queryFn: () => getApprovedCaregivers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
