import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Store, Sparkles } from "lucide-react";

export default function PizzaCard({ item }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border bg-card transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img
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
        <Badge
          variant="secondary"
          className="absolute right-3 top-3 bg-background/90 text-foreground"
        >
          {item.category}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-lg font-semibold">{item.name}</h3>
            <span className="shrink-0 text-lg font-bold text-red-600">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
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