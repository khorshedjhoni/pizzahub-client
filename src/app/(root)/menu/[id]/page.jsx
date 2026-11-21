"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Star, Store } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getBearerHeader() {
  const tokenRes = await fetch("/api/auth/token", { cache: "no-store" });
  if (!tokenRes.ok) return {};
  const { token } = await tokenRes.json();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [item, setItem] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingItem, setLoadingItem] = useState(true);

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/signin");
      return;
    }

    let active = true;
    async function fetchDetails() {
      setLoadingItem(true);
      try {
        const headers = await getBearerHeader();
        const res = await fetch(`${API_URL}/menu/${id}`, { headers });
        const json = await res.json();
        if (!res.ok) {
          if (active) setErrorMsg(json.message || "Item not found");
          return;
        }
        if (active) setItem(json.data);

        const revRes = await fetch(`${API_URL}/reviews/${id}`, { headers });
        if (revRes.ok) {
          const revJson = await revRes.json();
          if (active) setReviews(revJson.data || []);
        }
      } catch {
        if (active) setErrorMsg("Failed to load menu item");
      } finally {
        if (active) setLoadingItem(false);
      }
    }

    fetchDetails();
    return () => {
      active = false;
    };
  }, [id, session, isPending, router]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingOrder(true);
      const headers = {
        "Content-Type": "application/json",
        ...(await getBearerHeader()),
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          menuItemId: id,
          deliveryDate,
          deliveryAddress,
          message,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Could not place order");
        return;
      }

      toast.success("Order placed! Track it in your dashboard.");
      router.push("/dashboard/customer/orders");
    } catch (err) {
      toast.error(err?.message || "Order error");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      const headers = {
        "Content-Type": "application/json",
        ...(await getBearerHeader()),
      };
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers,
        body: JSON.stringify({ menuItemId: id, rating, comment }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to post review");
        return;
      }
      setReviews((prev) => [json.data, ...prev]);
      setComment("");
      setRating(5);
      toast.success("Review submitted");
    } catch {
      toast.error("Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isPending || loadingItem) {
    return <div className="p-12 text-center">Loading menu item details...</div>;
  }

  if (errorMsg || !item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Unavailable Item</h1>
        <p className="text-muted-foreground">{errorMsg || "Invalid item ID."}</p>
        <Button onClick={() => router.push("/menu")}>Back to Menu</Button>
      </div>
    );
  }

  const currentUser = session?.user;
  const isOwnItem =
    currentUser?.role === "vendor" && item.vendorId === currentUser?.id;
  const isAdmin = currentUser?.role === "admin";
  const canOrder =
    currentUser?.role === "customer" &&
    item.status === "approved" &&
    item.isAvailable &&
    !isOwnItem;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push("/menu")}
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse Menu
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 1. Sticky, interactive image frame */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-3">
          <div className="group overflow-hidden rounded-2xl border bg-muted h-80 sm:h-[420px] shadow-sm">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>{item.isAvailable ? "Available for order" : "Currently unavailable"}</span>
            {averageRating && (
              <span className="font-medium text-amber-500">
                ★ {averageRating} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>
        </div>

        {/* Item details + 2. Tightened Order Card */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary">{item.category}</Badge>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p className="text-2xl font-bold text-red-600">
              ${Number(item.price).toFixed(2)}
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {item.description}
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Vendor:</span>
              <span>{item.vendorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <span className="font-medium">Location:</span>
              <span>{item.location}</span>
            </div>
          </div>

          {canOrder ? (
            <Card className="border-red-500/20 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">Place Your Order</CardTitle>
                  <span className="text-sm font-semibold text-red-600">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ordering <span className="font-medium text-foreground">{item.name}</span> from{" "}
                  <span className="font-medium text-foreground">{item.vendorName}</span>
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Input
                      id="deliveryAddress"
                      placeholder="Street, apartment, city"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">
                      Additional Message / Special Instructions
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Extra chili flakes, call on arrival..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                    disabled={submittingOrder}
                  >
                    {submittingOrder
                      ? "Placing Order..."
                      : `Confirm Order · $${Number(item.price).toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
              {isOwnItem
                ? "You cannot order your own menu item."
                : isAdmin
                ? "Admins cannot place customer orders."
                : "Sign in as a Customer to place an order for this item."}
            </div>
          )}
        </div>
      </div>

      {/* 3. Reviews Section with average summary & clickable stars */}
      <div className="border-t pt-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">
            Customer Reviews ({reviews.length})
          </h2>
          {averageRating && (
            <div className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{averageRating}</span>
              <span className="text-muted-foreground font-normal">/ 5.0</span>
            </div>
          )}
        </div>

        {currentUser?.role === "customer" && (
          <form
            onSubmit={handleReviewSubmit}
            className="rounded-xl border bg-card p-4 space-y-3 max-w-xl"
          >
            <div className="flex items-center gap-3">
              <Label>Your Rating:</Label>
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const activeStar = (hoverRating || rating) >= starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      aria-label={`Rate ${starValue} out of 5 stars`}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          activeStar
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {rating} / 5
                </span>
              </div>
            </div>

            <Textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <Button
              type="submit"
              size="sm"
              disabled={submittingReview}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="rounded-lg border bg-card p-4 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {rev.customerName}
                </span>
                <span className="text-sm font-semibold text-amber-500">
                  ★ {rev.rating} / 5
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}