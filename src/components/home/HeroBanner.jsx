"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flame, Pizza } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden border-b bg-stone-950 py-12 text-white dark:border-zinc-800/80 sm:py-16">
      {/* Animated full-bleed background image */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src="/pizza.jpg"
          alt="Wood-fired pepperoni pizza slice"
          initial={{ scale: 1.04, opacity: 0.9 }}
          animate={{ scale: [1.04, 1.09, 1.04], opacity: 1 }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full object-cover object-right sm:object-center will-change-transform"
        />

        {/* Readability scrim: strong on left for text, open on right for pizza */}
        <div className="absolute inset-0 bg-black/50 lg:bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/75 to-transparent dark:from-black/95 dark:via-black/75 dark:to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-transparent to-zinc-950/40" />
      </div>

      {/* Foreground two-column layout */}
      <div className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 items-end gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Left side: Headline, description & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="space-y-5 lg:col-span-6"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-semibold text-amber-300 shadow-xs backdrop-blur-xs">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            Stone-Baked &amp; Delivered Hot
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-6xl">
            Hot &amp; Fresh Pizza{" "}
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Delivered to Your Door
            </span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-zinc-200 sm:text-lg">
            Explore top-rated neighborhood pizzerias, customize your feast, and
            track your delivery from oven to doorstep.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              nativeButton={false}
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/25 hover:from-red-700 hover:to-orange-700"
              render={<Link href="/menu">Explore Pizza Menu</Link>}
            />
            <Button
              nativeButton={false}
              variant="outline"
              size="lg"
              className="border-white/25 bg-zinc-900/75 text-white backdrop-blur-xs hover:bg-zinc-800/90 hover:text-white"
              render={<Link href="/signup">Become a Vendor</Link>}
            />
          </div>
        </motion.div>

        {/* Right side: Caption placed below the pizza slice area */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex items-start lg:col-span-6 lg:justify-end"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-950/75 px-4 py-2 text-xs font-medium text-amber-200 shadow-md backdrop-blur-md">
            <Pizza className="h-3.5 w-3.5 text-orange-400" />
            <span>Wood-Fired Classic &amp; Signature Slices</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}