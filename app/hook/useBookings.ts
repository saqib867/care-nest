import { useQuery } from "@tanstack/react-query";
import { getUserBookings, GetUserBookingsOptions } from "@/app/actions/booking";
import { useMe } from "@/app/hook/useMe";

export interface UseBookingsOptions extends GetUserBookingsOptions {
  queryKeyPrefix?: string | readonly unknown[];
  queryKeyTag?: string;
  key?: string;
  search?: string;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const { status = "ALL", search = "", page = 1, limit = 10, queryKeyPrefix } = options;
  const { data: me, isLoading: isMeLoading } = useMe();

  const userId = me?.id;
  const isCaregiver = me?.isCaregiver ?? false;

  const tag = queryKeyPrefix || options.queryKeyTag || options.key;
  const prefix = tag
    ? Array.isArray(tag)
      ? tag
      : [tag]
    : [];

  return useQuery({
    queryKey: [...prefix, "bookings", userId, isCaregiver, status, search, page, limit],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User session not found.");
      }

      const res = await getUserBookings(userId, isCaregiver, {
        status: status === "ALL" ? undefined : status, // don't filter when ALL
        search: search ? String(search).trim() : undefined,
        page,
        limit,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to fetch bookings.");
      }

      return {
        bookings: res.bookings ?? [],
        totalCount: res.totalCount ?? 0,
        totalPages: res.totalPages ?? 1,
        page: res.page ?? page,
        limit: res.limit ?? limit,
        role: res.role,
        counts: res.totalCount ?? {},
      };
    },
    enabled: Boolean(userId) && !isMeLoading,
    staleTime: 5000,
  });
}

