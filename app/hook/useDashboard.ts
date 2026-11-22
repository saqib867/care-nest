import { useRouter } from "next/navigation";
import { useDashboardStore } from "./useDashboardStore";
import { useMe, useLogout } from "./useMe";

export function useDashboardAuth() {
  const router = useRouter();
  const logout = useLogout();
  const store = useDashboardStore();
  const { data: me, isLoading: isMeLoading, refetch: refetchMe } = useMe();

  const userId = me?.id || me?.user?.id || null;
  const dbRole = me?.role || null;
  const role = me?.isCaregiver
    ? "caregiver"
    : me?.isFamily
      ? "family"
      : "family";

  const userName =
    me?.firstName || me?.lastName
      ? `${me.firstName || ""} ${me.lastName || ""}`.trim()
      : me?.email || "User";

  const handleLogout = async (customRouter?: any) => {
    await logout(customRouter || router);
  };

  return {
    me,
    user: me?.user ?? null,
    profile: me?.profile ?? null,
    isMeLoading,
    refetchMe,
    authLoading: isMeLoading,
    role,
    dbRole,
    userName,
    userId,
    handleLogout,
    fetchDashboardData: store.fetchDashboardData,
    bookings: store.bookings,
    setBookings: store.setBookings,
  };
}





export function useReviewModal() {
  const store = useDashboardStore();
  return {
    showReviewModal: store.showReviewModal,
    setShowReviewModal: store.setShowReviewModal,
    reviewRating: store.reviewRating,
    setReviewRating: store.setReviewRating,
    reviewComment: store.reviewComment,
    setReviewComment: store.setReviewComment,
    handleAddReview: store.handleAddReview,
  };
}

