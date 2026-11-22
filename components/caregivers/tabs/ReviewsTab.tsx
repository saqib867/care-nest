"use client";

import { Star } from "lucide-react";

interface ReviewsTabProps {
  cg: any;
}

export function ReviewsTab({ cg }: ReviewsTabProps) {
  const reviews = [
    {
      id: "rev-1",
      author: "Thomas M.",
      rating: 5,
      date: "July 24, 2026",
      comment:
        "Exceptional service. Elena has been helping care for my elderly mother with dementia twice a week. She is extremely patient, highly professional, and has a natural warmth that immediately made my mother feel safe.",
    },
    {
      id: "rev-2",
      author: "Sarah L.",
      rating: 5,
      date: "June 15, 2026",
      comment:
        "Extremely reliable and communicative caregiver. Always on time, sends daily logs, and coordinates medication flawlessly. Highly recommend!",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-lg text-primary">Client Feedback</h2>

      {/* Reviews List */}
      <div className="space-y-6 divide-y divide-border">
        {reviews.map((rev, idx) => (
          <div key={rev.id} className={idx > 0 ? "pt-6" : ""}>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground">
                {rev.author}
              </h4>
              <span className="text-xs text-muted-foreground">{rev.date}</span>
            </div>
            <div className="flex items-center gap-0.5 text-amber-500 my-1">
              {Array.from({ length: rev.rating }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
