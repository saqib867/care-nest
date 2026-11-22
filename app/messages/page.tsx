"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MessagesRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const userName = searchParams.get("userName");

    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (userName) params.append("userName", userName);

    router.replace(`/dashboard/messages?${params.toString()}`);
  }, [router, searchParams]);

  return null;
}

export default function MessagesRedirectPage() {
  return (
    <Suspense fallback={null}>
      <MessagesRedirectContent />
    </Suspense>
  );
}

