"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flame, Pizza } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-amber-50 via-orange-50/75 to-rose-50/70 py-16 text-foreground dark:border-zinc-800/80 dark:from-zinc-950 dark:via-stone-950 dark:to-neutral-950 sm:py-24">
      {/* Matching warm radial & ambient gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-orange-400/20 via-amber-300/15 to-transparent blur-3xl dark:from-orange-600/15 dark:via-red-600/10 dark:to-transparent"
      />
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-16 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-gradient-to-tr from-red-500/20 via-orange-500/20 to-amber-400/20 blur-3xl dark:from-red-600/25 dark:via-orange-500/15 dark:to-amber-500/15"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        {/* Left column: Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-6 lg:col-span-5"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/90 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-red-700 shadow-xs backdrop-blur-xs dark:border-orange-500/25 dark:bg-zinc-900/90 dark:text-amber-300">
            <Flame className="h-3.5 w-3.5 text-red-600 dark:text-orange-400" />
            Stone-Baked &amp; Delivered Hot
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl leading-[1.08]">
            Hot &amp; Fresh Pizza{" "}
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-red-500 dark:via-orange-400 dark:to-amber-300">
              Delivered to Your Door
            </span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-muted-foreground dark:text-zinc-300 sm:text-lg">
            Explore top-rated neighborhood pizzerias, customize your feast, and
            track your delivery from oven to doorstep.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              nativeButton={false}
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/20 hover:from-red-700 hover:to-orange-700"
              render={<Link href="/menu">Explore Pizza Menu</Link>}
            />
            <Button
              nativeButton={false}
              variant="outline"
              size="lg"
              className="border-orange-200/90 bg-white/80 backdrop-blur-xs hover:bg-white dark:border-zinc-700/90 dark:bg-zinc-900/85 dark:text-zinc-100 dark:hover:bg-zinc-800"
              render={<Link href="/signup">Become a Vendor</Link>}
            />
          </div>
        </motion.div>

        {/* Right column: Gradient-matched bordered pizza showcase with motion */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative flex items-center justify-center lg:col-span-7"
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-0.6, 0.8, -0.6] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-br from-amber-300/50 via-orange-400/35 to-red-500/40 p-[1.5px] shadow-xl shadow-orange-950/10 dark:from-amber-400/35 dark:via-orange-500/25 dark:to-red-600/35 dark:shadow-black/60"
          >
            <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-amber-50 via-orange-50/70 to-zinc-950 dark:from-zinc-900 dark:via-stone-950 dark:to-black">
              <img
                src="/pizza.jpg"
                alt=""
                aria-hidden="true"
                className="aspect-[16/10] w-full object-cover sm:aspect-[16/9]"
              />

              {/* Subtle edge blending gradients matching banner & border */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-amber-950/45 via-transparent to-amber-100/15 dark:from-zinc-950/75 dark:via-transparent dark:to-orange-500/10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-50/35 via-transparent to-orange-500/10 dark:from-zinc-950/55 dark:via-transparent dark:to-amber-500/10"
              />

              {/* Floating corner pill with subtle motion */}
              <motion.div
                aria-hidden="true"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-full border border-amber-300/60 bg-white/85 px-3.5 py-1.5 text-xs font-medium text-stone-800 shadow-md backdrop-blur-md dark:border-amber-400/25 dark:bg-zinc-900/85 dark:text-amber-200"
              >
                <Pizza className="h-3.5 w-3.5 text-red-600 dark:text-amber-400" />
                <span>Wood-Fired Classic &amp; Signature Slices</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}