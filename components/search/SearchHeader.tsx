"use client";

import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Heart className="size-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">
            Care<span className="text-secondary font-semibold">Nest</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="size-4" /> Go Back
          </button>
        </div>
      </div>
    </header>
  );
}
