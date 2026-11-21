import Link from "next/link";
import { Pizza, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-amber-50/60 dark:bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-red-600"
            >
              <Pizza className="h-7 w-7 text-orange-500" />
              <span>PizzaHub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Freshly baked artisan pizzas, local pizzerias, and fast delivery
              straight to your table.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-red-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-red-600">
                  Browse Menu
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-red-600">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-red-600">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600 shrink-0" />
                <span>24 Oven Street, Food District</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-600 shrink-0" />
                <span>+1 (555) 234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-red-600 shrink-0" />
                <span>support@pizzahub.app</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Follow Us
            </h3>
            <div className="flex items-center gap-3">
              {/* X logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="PizzaHub on X"
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-background hover:border-red-600 hover:text-red-600 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook SVG */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="PizzaHub on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-background hover:border-red-600 hover:text-red-600 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M13.5 22v-8.2h2.7l.4-3.2h-3.1V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.7v3.2h2.7V22h3.1z" />
                </svg>
              </a>

             
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="PizzaHub on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-background hover:border-red-600 hover:text-red-600 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PizzaHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}