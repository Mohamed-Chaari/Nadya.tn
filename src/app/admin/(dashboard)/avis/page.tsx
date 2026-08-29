import type { Metadata } from "next";
import Link from "next/link";
import { getAllReviews } from "@/lib/reviews/get-all-reviews";
import { ReviewActionButtons } from "@/components/admin/review-action-buttons";

export const metadata: Metadata = {
  title: "Avis — Admin NADYA",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Rejeté",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const FILTER_TABS = [
  { label: "En attente", value: "pending" },
  { label: "Approuvés", value: "approved" },
  { label: "Rejetés", value: "rejected" },
  { label: "Tous", value: "all" },
];

interface PageProps {
  searchParams: Promise<{ statut?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const { statut = "pending" } = await searchParams;
  const reviews = await getAllReviews();
  const filtered = statut === "all" ? reviews : reviews.filter((r) => r.status === statut);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-nadya-black">Avis clients</h1>
        <p className="text-sm text-nadya-black/60">
          {filtered.length} avis
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const isActive = statut === tab.value;
          return (
            <Link
              key={tab.value}
              href={`/admin/avis?statut=${tab.value}`}
              className={`border px-3 py-1.5 text-sm transition ${
                isActive
                  ? "border-nadya-black bg-nadya-black text-nadya-cream"
                  : "border-nadya-line bg-white text-nadya-black/70 hover:border-nadya-black"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="border border-nadya-line bg-white p-8 text-center text-sm text-nadya-black/50">
          Aucun avis.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="border border-nadya-line bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-nadya-black">{review.customerName}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[review.status]}`}
                    >
                      {STATUS_LABELS[review.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-nadya-black/50">{review.productName}</p>
                  {review.customerPhone && (
                    <a
                      href={`tel:${review.customerPhone}`}
                      className="mt-0.5 inline-block text-xs text-nadya-gold-dark hover:underline"
                    >
                      {review.customerPhone}
                    </a>
                  )}
                </div>
                <div className="text-nadya-gold" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>

              <p className="mt-3 text-sm text-nadya-black/75">{review.comment}</p>

              <div className="mt-4">
                <ReviewActionButtons reviewId={review.id} status={review.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
