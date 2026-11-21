# 🍕 PizzaHub — Pizza Ordering & Delivery Platform

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=nextdotjs)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-REST%20API-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout%20%26%20Webhooks-635BFF?logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-ShadCN%20UI-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

**PizzaHub** is a full-stack, role-based pizza ordering and delivery platform connecting **Customers**, **Vendors (Restaurant Owners)**, and **Administrators**. Customers browse pizzas, filter by category or location, view item details, and place orders; vendors manage menus, incoming orders, and Stripe-powered Premium subscriptions; and admins oversee users, menu approvals, and read-only subscription transaction logs.

---

## 🌐 Links & Repositories

| Resource | Link |
| :--- | :--- |
| **Live Website** | `https://your-pizzahub-live-url.vercel.app` |
| **Client GitHub Repository** | `https://github.com/khorshedjhoni/<your-client-repo>` |
| **Server GitHub Repository** | `https://github.com/khorshedjhoni/<your-server-repo>` |

---

## ✨ Key Features

### 🔐 Authentication & Role-Based Access Control
* Powered by **Better Auth** (with MongoDB adapter) and **Google OAuth**, alongside **JWT** verification and role-based middleware on protected backend routes.
* Public registration supports **Customer** and **Vendor** accounts with password validation (minimum 6 characters, uppercase and lowercase letters); admin access is assigned securely.
* Strict server-side role and resource-ownership checks prevent unauthorized cross-role dashboard access or self-promotion.

### 🏠 Storefront, Menu Discovery & Order Flow
* **Home Page:** Pizza-themed banner, **Featured Menu Items** (approved and active items), **Pizza Categories** (*Classic Pizzas*, *Vegetarian Pizzas*, *Meat Lovers*, *Specialty / Gourmet Pizzas*, *Sides & Appetizers*, *Beverages & Desserts*), **Why Choose PizzaHub?**, and an additional highlight section enhanced with smooth **Framer Motion** animations.
* **Browse Menu & Item Details (`/menu/[id]`):** Search by name, filter by category and location, view item details and pricing, and place orders with delivery date, delivery address, and special instructions.
* **Order Guardrails:** Prevents vendors from ordering their own items, blocks admins from placing customer orders, and prevents duplicate active orders for the same item and delivery date.

### 🏪 Role-Specific Dashboards
* **Customer Dashboard:** Order statistics (total, pending, accepted, rejected) and **My Orders** with order tracking and cancellation for pending orders[cite: 1.2].
* **Vendor Dashboard:** Menu and order overview, **Add Menu Item** (with **ImgBB** image upload and Free plan limit of 3 active items vs. Premium unlimited), **My Menu Items** (CRUD & availability), **Customer Orders** (accept/reject pending orders once), and **Subscription** upgrade flow[cite: 1.2].
* **Admin Dashboard:** Platform KPIs, **Manage Users** (search, filter by role, block/unblock), **Manage Menu Items** (approve, reject, status updates, delete), and **Transactions** (read-only vendor subscription payment history)[cite: 1.2].

### 💳 Stripe Vendor Subscription & Webhooks
* Vendors initiate a **Stripe Checkout** session to upgrade from **Free** to **Premium** (unlimited active menu items, Premium badge, and featured placement)[cite: 1.2].
* Premium access and `transactions` records are finalized via **Stripe webhook verification**, never trusted solely from the client redirect URL[cite: 1.2].

---
## 🧩 Implementation Notes: Challenge Requirements

### 1. Advanced Menu Search & Price Sorting
To deliver responsive menu discovery across both storefront and browse views, search, filtering, and price sorting are driven by explicit API query parameters and structured MongoDB query construction rather than client-only filtering:

* **Supported Query Parameters:**
  * `search`: Case-insensitive text matching against menu item names and descriptions (e.g., `search=margherita`).
  * `category`: Exact or normalized category filtering (e.g., `category=Classic%20Pizzas`).
  * `location`: Area or city filtering for local restaurant availability (e.g., `location=Dhaka`).
  * `sortBy` & `order`: Supports sorting menu items by price in ascending (`sortBy=price&order=asc`) or descending (`sortBy=price&order=desc`) order, with safe fallback defaults when omitted or invalid.
  * `status`: Enforces visibility rules (such as restricting public listings to approved/active items while allowing role-scoped views in dashboards).
* **Request & Execution Flow:**
  1. The Next.js client synchronizes filter inputs, search terms, and sort selection with URL/API query parameters and triggers loading/empty states cleanly.
  2. The Express route handler normalizes and validates query parameters on the server before assembling the MongoDB filter and sort specification.
  3. MongoDB executes the filtered and price-sorted query (`1` for ascending, `-1` for descending) and returns a consistent payload to the frontend.

### 2. JWT & Role-Based Middleware Flow
Authentication and authorization are enforced on the server for every private route so frontend UI checks or client-supplied user IDs/roles can never be trusted:

* **Token Verification Middleware (`verifyToken`):**
  1. Extracts the JWT from the `Authorization: Bearer <token>` header (or authenticated session/cookie flow).
  2. Verifies the token signature and expiration using the server-side secret; rejects missing, malformed, or expired tokens with `401 Unauthorized`.
  3. Loads/attaches the verified user context to `req.user` and checks account restrictions (such as blocked user status) before allowing access to protected resources.
* **Role & Ownership Authorization Middleware (`authorizeRole` & Resource Checks):**
  1. Evaluates `req.user.role` (`customer`, `vendor`, or `admin`) against allowed roles for the endpoint; returns `403 Forbidden` if unauthorized.
  2. Verifies record ownership or business rules on mutations (e.g., vendors can only manage their own menu items and orders; customers can only cancel their own pending orders; subscription activation relies on verified Stripe webhook events; admin transaction records remain read-only).

### 3. Professional UI/UX & Visual Consistency
* Designed a cohesive pizza-themed interface combining warm reds, oranges, and cream surfaces with dark-mode support, accessible contrast, and responsive layouts across mobile, tablet, and desktop viewports.
* Standardized typography, spacing, uniform card sizing, and ShadCN UI components across public pages and role-based dashboards, paired with Framer Motion transitions, loading states, custom error handling, and `sonner` toast feedback.


## 🛠️ Technology Stack & NPM Packages

### Frontend (Next.js App Router)
* **Core Framework & UI:** `next`, `react`, `react-dom`, `tailwindcss`, `shadcn/ui` (Radix/UI primitives), `lucide-react`, `framer-motion` / `motion`, `sonner`[cite: 1.2]
* **Auth & Utilities:** `better-auth` (add your exact client packages from `package.json`)[cite: 1.2]

### Backend (Express.js & MongoDB)
* **Core Server & Database:** `express`, `mongodb`, `cors`, `dotenv`[cite: 1.2]
* **Auth, Security & Payments:** `better-auth`, `@better-auth/mongo-adapter`, `jsonwebtoken` / `jose`, `stripe`[cite: 1.2]

> **Tip:** Replace the package list above with the exact dependencies from your `client/package.json` and `server/package.json` before submitting.

---

## 🚀 Installation & Running Locally

### 1. Clone Both Repositories
```bash
git clone [https://github.com/khorshedjhoni/](https://github.com/khorshedjhoni/)<your-client-repo>.git pizzahub-client
git clone [https://github.com/khorshedjhoni/](https://github.com/khorshedjhoni/)<your-server-repo>.git pizzahub-server
