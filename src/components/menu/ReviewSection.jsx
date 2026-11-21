"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, MessageSquare, Send, Star } from "lucide-react";
import { toast } from "sonner";
import { getClientToken } from "@/lib/auth-client";
import {
  fetchMenuItemReviews,
  postMenuItemReview,
} from "@/lib/api/menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo } from "@/lib/utils";

function initials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "PH"
  );
}

function Stars({ value = 0, size = "size-4" }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </span>
  );
}

export default function ReviewSection({ itemId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMenuItemReviews(itemId)
      .then((data) => {
        if (active) setReviews(data || []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [itemId]);

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );
    return total / reviews.length;
  }, [reviews]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!comment.trim()) {
      toast.error("Write a few words about this pizza first.");
      return;
    }

    setSubmitting(true);
    try {
      const token = await getClientToken();
      if (!token) {
        toast.error("Please sign in again to leave a review.");
        return;
      }
      const result = await postMenuItemReview(
        itemId,
        { rating, comment: comment.trim() },
        token,
      );
      const created =
        result?.data?.review || result?.review || result?.data || {
          id: `local-${Date.now()}`,
          rating,
          comment: comment.trim(),
          createdAt: new Date().toISOString(),
          user: { name: "You" },
        };
      setReviews((current) => [created, ...current]);
      setComment("");
      setRating(5);
      toast.success("Review posted. Thanks for sharing!");
    } catch (error) {
      toast.error(error.message || "Could not post your review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <MessageSquare className="size-3.5" />
            Community reviews
          </p>
          <h2 className="mt-2 font-display text-2xl font-black sm:text-3xl">
            What people are saying
          </h2>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card px-4 py-3">
          <span className="font-display text-3xl font-black">
            {average ? average.toFixed(1) : "—"}
          </span>
          <div>
            <Stars value={average} />
            <p className="mt-0.5 text-xs text-muted-foreground">
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
        >
          <h3 className="font-display text-lg font-bold">Leave a review</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Ordered this pizza? Tell everyone how it was.
          </p>

          <div className="mt-4 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="rounded-md p-0.5 transition hover:scale-110"
                aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
              >
                <Star
                  className={`size-7 ${
                    star <= (hovered || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-semibold text-muted-foreground">
              {hovered || rating}/5
            </span>
          </div>

          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Crispy crust, generous toppings, arrived hot…"
            className="mt-4 min-h-24"
            maxLength={600}
          />

          <Button
            type="submit"
            className="mt-3 w-full"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {submitting ? "Posting…" : "Post review"}
          </Button>
        </form>

        <div className="space-y-3">
          {loading ? (
            <>
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </>
          ) : reviews.length ? (
            reviews.map((review, index) => (
              <article
                key={review.id || review._id || index}
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={review.user?.image || review.userImage || ""}
                        alt={review.user?.name || review.name || "Customer"}
                      />
                      <AvatarFallback>
                        {initials(review.user?.name || review.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold">
                        {review.user?.name || review.name || "Pizza lover"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {timeAgo(review.createdAt || review.date)}
                      </p>
                    </div>
                  </div>
                  <Stars value={Number(review.rating || 0)} size="size-3.5" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {review.comment || review.text}
                </p>
              </article>
            ))
          ) : (
            <div className="flex h-full min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
              <span className="text-4xl">💬</span>
              <h3 className="mt-3 font-display text-lg font-bold">
                No reviews yet
              </h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Be the first to share your thoughts on this pizza.
              </p>
            </div>
          )}
        </div>
      </div>
      <Separator className="mt-10" />
    </section>
  );
}
