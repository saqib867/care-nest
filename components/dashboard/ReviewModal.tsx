import { Star } from "lucide-react";
import { useReviewModal } from '@/app/hook/useDashboard';

export default function ReviewModal() {
  const {
    showReviewModal,
    setShowReviewModal,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    handleAddReview
  } = useReviewModal();

  if (!showReviewModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={handleAddReview} className="bg-white w-full max-w-md rounded-2xl border border-gray-100 p-6 shadow-2xl space-y-5 animate-scale-up">
        <h3 className="text-lg font-extrabold text-gray-900">Write a Review</h3>

        {/* Stars */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 font-sans">Rating Selection</label>
          <div className="flex gap-2 text-amber-500">
            {[1, 2, 3, 4, 5].map((stars) => (
              <button
                key={stars}
                type="button"
                onClick={() => setReviewRating(stars)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <Star className={`size-6 ${reviewRating >= stars ? "fill-current" : "stroke-1"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 font-sans">Caregiver Feedback Comment</label>
          <textarea
            required
            rows={4}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="How was your care companion's service? e.g. Very patient, great medication monitoring..."
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            type="button"
            onClick={() => setShowReviewModal(false)}
            className="flex-1 inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button 
            type="submit"
            className="flex-1 inline-flex h-9 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-colors shadow-sm cursor-pointer"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
}
