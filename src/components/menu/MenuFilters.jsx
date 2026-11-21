"use client";

import { useMemo, useState } from "react";
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import PizzaCard from "@/components/shared/PizzaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PIZZA_CATEGORIES } from "@/lib/api/menu";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "featured", label: "Featured first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
];

export default function MenuFilters({
  items = [],
  initialCategory = "",
  initialSearch = "",
  initialLocation = "",
  initialSort = "featured",
}) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory || "all");
  const [location, setLocation] = useState(initialLocation || "all");
  const [sort, setSort] = useState(initialSort || "featured");

  const categories = useMemo(() => {
    const fromItems = items.map((item) => item.category).filter(Boolean);
    return Array.from(new Set([...PIZZA_CATEGORIES.map((entry) => entry.name), ...fromItems]));
  }, [items]);

  const locations = useMemo(() => {
    return Array.from(
      new Set(items.map((item) => item.location).filter(Boolean)),
    ).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = items.filter((item) => {
      const matchesSearch =
        !term ||
        [item.name, item.description, item.vendorName, item.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      const matchesCategory =
        category === "all" ||
        String(item.category).toLowerCase() === category.toLowerCase();
      const matchesLocation =
        location === "all" ||
        String(item.location).toLowerCase() === location.toLowerCase();
      return matchesSearch && matchesCategory && matchesLocation;
    });

    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => Number(a.price) - Number(b.price));
      case "price-desc":
        return [...result].sort((a, b) => Number(b.price) - Number(a.price));
      case "rating":
        return [...result].sort(
          (a, b) => Number(b.rating) - Number(a.rating),
        );
      case "newest":
        return [...result].sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
      default:
        return [...result].sort(
          (a, b) => Number(b.isPremium) - Number(a.isPremium),
        );
    }
  }, [items, search, category, location, sort]);

  const hasFilters =
    search ||
    category !== "all" ||
    location !== "all" ||
    sort !== "featured";

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setLocation("all");
    setSort("featured");
  }

  return (
    <div>
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pizzas, vendors or toppings…"
              className="pl-9"
              aria-label="Search pizzas"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:w-auto">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full lg:w-40" aria-label="Filter by category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((entry) => (
                  <SelectItem key={entry} value={entry}>
                    {entry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full lg:w-40" aria-label="Filter by location">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {locations.map((entry) => (
                  <SelectItem key={entry} value={entry}>
                    {entry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="col-span-2 w-full sm:col-span-1 lg:w-48" aria-label="Sort pizzas">
                <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((entry) => (
                  <SelectItem key={entry.value} value={entry.value}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Filter className="size-3.5" />
            Quick picks:
          </span>
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              category === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary/40",
            )}
          >
            All
          </button>
          {PIZZA_CATEGORIES.map((entry) => (
            <button
              key={entry.name}
              type="button"
              onClick={() => setCategory(entry.name)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition",
                category === entry.name
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/40",
              )}
            >
              {entry.emoji} {entry.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{filtered.length}</span>{" "}
          pizza{filtered.length === 1 ? "" : "s"} found
        </p>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="size-3.5" />
            Reset filters
          </Button>
        ) : null}
      </div>

      {filtered.length ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <PizzaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-muted text-3xl">
            🍕
          </span>
          <h3 className="mt-4 font-display text-xl font-bold">
            No pizzas match those filters
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Try a different category or location — the perfect slice is still
            out there.
          </p>
          <Button variant="outline" className="mt-5" onClick={resetFilters}>
            <RotateCcw className="size-4" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
