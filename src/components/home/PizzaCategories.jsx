"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pizza, Sparkles } from "lucide-react";

export const PIZZA_CATEGORIES = [
  {
    name: "Classic Pizzas",
    image: "/classic_pizza.jpg",
    tag: null,
  },
  {
    name: "Vegetarian Pizzas",
    image: "veg_pizza.jpg",
    tag: null,
  },
  {
    name: "Meat Lovers",
    image: "meat_pizza.jpg",
    tag: "POPULAR",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    image: "Gourmet_pizzas.jpg",
    tag: "NEW ARRIVAL",
  },
  {
    name: "Sides & Appetizers",
    image: "site.jpg",
    tag: null,
  },
  {
    name: "Beverages & Desserts",
    image: "Beverages & Desserts.jpg",
    tag: null,
  },
];

export default function PizzaCategories({
  categories = PIZZA_CATEGORIES,
  items = [],
}) {
  const displayCategories =
    items.length > 0
      ? categories.map((cat) => {
          const count = items.filter(
            (item) =>
              item.category?.trim().toLowerCase() === cat.name.toLowerCase()
          ).length;
          return { ...cat, count };
        })
      : categories;

  return (
    <section className="border-b bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              <Pizza className="h-3.5 w-3.5" />
              <span>Pizza Categories</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Explore by Category
            </h2>
          </div>

          <Link
            href="/menu"
            className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="flex justify-center"
            >
              <Link
                href={`/menu?category=${encodeURIComponent(category.name)}`}
                className="group flex max-w-[140px] flex-col items-center text-center focus:outline-none"
              >
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full p-1 transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-red-500">
                  <div className="h-full w-full overflow-hidden rounded-full border-2 border-stone-200/90 bg-muted shadow-md transition-all duration-300 group-hover:border-red-500 group-hover:shadow-lg dark:border-zinc-800 dark:group-hover:border-red-400">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {category.tag && (
                    <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-stone-950 shadow-sm ring-2 ring-background">
                      <span className="inline-flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5" />
                        {category.tag}
                      </span>
                    </span>
                  )}

                  {typeof category.count === "number" && category.count > 0 && (
                    <span className="absolute -bottom-1 right-1 rounded-full border bg-card px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-xs">
                      {category.count}
                    </span>
                  )}
                </div>

                <span className="mt-3 line-clamp-2 text-xs font-semibold leading-snug text-foreground/90 transition-colors group-hover:text-red-600 dark:group-hover:text-red-400 sm:text-sm">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}