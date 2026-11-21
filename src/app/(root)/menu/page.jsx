"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PizzaCard from "@/components/shared/PizzaCard";
import { PIZZA_CATEGORIES } from "@/components/home/PizzaCategories";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function BrowseMenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    let active = true;
    async function loadItems() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (category && category !== "all") params.set("category", category);
        if (location.trim()) params.set("location", location.trim());
        if (sort !== "default") params.set("sort", sort);

        const res = await fetch(`${API_URL}/menu?${params.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (active) setItems(json.data || []);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadItems();
    return () => {
      active = false;
    };
  }, [search, category, location, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Browse Pizza Menu</h1>
        <p className="text-sm text-muted-foreground">
          Search by pizza name, filter by category or location, and sort by price
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border bg-card p-4">
        <Input
          placeholder="Search by pizza name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
{PIZZA_CATEGORIES.map((cat) => {
  const categoryName = typeof cat === "string" ? cat : cat.name;
  return (
    <SelectItem key={categoryName} value={categoryName}>
      {categoryName}
    </SelectItem>
  );
})}
          </SelectContent>
        </Select>

        <Input
          placeholder="Filter by area or city..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Featured &amp; Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          No matching pizzas found. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <PizzaCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrowseMenuPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading menu...</div>}>
      <BrowseMenuContent />
    </Suspense>
  );
}