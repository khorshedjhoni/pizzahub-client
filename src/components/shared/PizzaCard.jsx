"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Store, Sparkles, Heart } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner"; // or your toast library

export default function PizzaCard({
  item,
  isFavoritedInitial = false,
  onToggleFavorite,
}) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(Boolean(isFavoritedInitial));
  const [isToggling, setIsToggling] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return;
    setIsToggling(true);

    const previousState = isFavorite;
    setIsFavorite(!previousState); // Optimistic UI update

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/favorites/${item._id}`,
        {
          method: "POST",
          credentials: "include", // sends JWT / session cookie if cookie-based
          headers: {
            "Content-Type": "application/json",
            // If using Bearer token from auth context/localStorage:
            // ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (res.status === 401) {
        setIsFavorite(previousState);
        toast.error("Please sign in to save favorites");
        router.push("/sign-in");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setIsFavorite(previousState);
        toast.error(data?.message || "Could not update favorites");
        return;
      }

      const nextFav = Boolean(data?.data?.isFavorite);
      setIsFavorite(nextFav);
      toast.success(
        nextFav ? "Added to your favorites" : "Removed from favorites"
      );

      if (typeof onToggleFavorite === "function") {
        onToggleFavorite(item._id, nextFav);
      }
    } catch {
      setIsFavorite(previousState);
      toast.error("Network error while updating favorites");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden border bg-card transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <Image
          width={300}
          height={200}
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {item.isPremiumVendor && (
          <Badge className="absolute left-3 top-3 bg-amber-500 text-black hover:bg-amber-500 gap-1">
            <Sparkles className="h-3 w-3" />
            Premium
          </Badge>
        )}

        {/* Favorite button placed cleanly on the top-right */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={isToggling}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-xs transition hover:scale-105 disabled:opacity-60"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite
                ? "fill-red-600 text-red-600"
                : "text-muted-foreground hover:text-red-600"
            }`}
          />
        </button>
      </div>

      <CardContent className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-lg font-semibold">{item.name}</h3>
            <span className="shrink-0 text-lg font-bold text-red-600">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>

          <div>
            <Badge variant="secondary" className="text-xs font-normal">
              {item.category}
            </Badge>
          </div>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1.5 truncate">
            <Store className="h-3.5 w-3.5 text-orange-500 shrink-0" />
            <span className="truncate">{item.vendorName}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          nativeButton={false}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          render={<Link href={`/menu/${item._id}`}>View Details</Link>}
        />
      </CardFooter>
    </Card>
  );
}