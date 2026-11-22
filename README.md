# 🍕 PizzaHub — Pizza Ordering & Delivery Platform

<p align="center">
  <strong>A Full-Stack, Role-Based Pizza Ordering & Restaurant Management Platform</strong>
</p>

<p align="center">
  Discover local pizza restaurants, explore delicious menus, place orders, manage restaurant operations, and grow your business with Premium subscriptions.
</p>

<p align="center">
  <a href="https://pizzahub-demo.vercel.app/">🌐 Live Website</a> •
  <a href="https://github.com/khorshedjhoni/pizzahub-client">💻 Client Repository</a> •
  <a href="https://github.com/khorshedjhoni/pizzahub-server">⚙️ Server Repository</a>
</p>

## 📌 Project Overview

**PizzaHub** is a full-stack pizza ordering and delivery platform designed to connect customers with local pizza restaurants.

The platform provides three different user roles: **Customer, Vendor (Restaurant Owner), and Admin**. Each role has dedicated permissions, dashboard functionality, and management capabilities.

Customers can discover nearby restaurants, browse pizza menus, search and filter menu items, view product details, place delivery orders, and track their order status.

Vendors can create restaurant profiles, publish and manage menu items, receive customer orders, accept or reject orders, and upgrade their accounts to Premium subscriptions.

Administrators have centralized control over platform users, menu item approvals, restaurant activities, and subscription transactions.

PizzaHub is built as a functional business-oriented application with authentication, role-based authorization, REST APIs, MongoDB data management, JWT verification, image hosting, and Stripe-powered vendor subscriptions.

### 🎯 Project Goals

- Build a real-world multi-role food ordering platform.
- Implement secure authentication and authorization.
- Develop reusable and maintainable frontend components.
- Create RESTful APIs with Express.js and MongoDB.
- Implement advanced searching, filtering, and sorting.
- Integrate Stripe Checkout and secure webhook verification.
- Deliver a responsive and professional user experience.
- Apply server-side validation, resource ownership checks, and error handling.

---

## 🌐 Live Project & Repositories

| Resource             | URL                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| 🌐 Live Website      | [https://pizzahub-demo.vercel.app/](https://pizzahub-demo.vercel.app/)                               |
| 💻 Client Repository | [https://github.com/khorshedjhoni/pizzahub-client](https://github.com/khorshedjhoni/pizzahub-client) |
| ⚙️ Server Repository | [https://github.com/khorshedjhoni/pizzahub-server](https://github.com/khorshedjhoni/pizzahub-server) |

---

## ✨ Key Features

### 🔐 1. Authentication & Authorization

- Better Auth integration with MongoDB adapter.
- Email and password authentication.
- Google OAuth authentication.
- Password validation with minimum 6 characters, including uppercase and lowercase letters.
- Customer and Vendor registration.
- Secure Admin account management.
- JWT generation and verification.
- Role-based dashboard access.
- Protected frontend routes and backend APIs.
- Session persistence and authentication-aware navigation.
- Blocked-user access restrictions.

### 🍕 2. Public Storefront & Pizza Discovery

- Professional pizza-themed landing page.
- Responsive navigation and footer.
- Hero banner with menu exploration CTA.
- Featured menu items dynamically loaded from MongoDB.
- Six pizza and food categories:
  - Classic Pizzas
  - Vegetarian Pizzas
  - Meat Lovers
  - Specialty / Gourmet Pizzas
  - Sides & Appetizers
  - Beverages & Desserts
- Restaurant and vendor information.
- Responsive menu cards.
- Item details with descriptions, images, pricing, and location.
- Loading, empty, and error states.

### 🔎 3. Advanced Menu Search, Filtering & Sorting

Customers can discover menu items through server-side filtering and sorting.

Supported features:

- Search menu items by name.
- Filter by pizza category.
- Filter by restaurant location.
- Sort prices from low to high.
- Sort prices from high to low.
- Display only approved and active menu items publicly.
- Validate and normalize query parameters on the backend.

Example API requests:

```http
GET /menu-items?search=margherita
GET /menu-items?category=Classic%20Pizzas
GET /menu-items?location=Dhaka
GET /menu-items?sortBy=price&order=asc
GET /menu-items?sortBy=price&order=desc
```

The backend builds MongoDB filters and sorting rules based on validated query parameters rather than relying exclusively on frontend filtering.



## ⚡ Challenge Implementation Details

This section explains the implementation of the assignment's main technical challenges.

### Challenge 1: Advanced Menu Search & Price Sorting

Menu discovery is implemented using API query parameters and server-side MongoDB filtering.

**Supported query parameters:**

| Parameter  | Purpose               | Example                      |
| ---------- | --------------------- | ---------------------------- |
| `search`   | Search by item name   | `?search=margherita`         |
| `category` | Filter by category    | `?category=Classic%20Pizzas` |
| `location` | Filter by location    | `?location=Dhaka`            |
| `sortBy`   | Select sorting field  | `?sortBy=price`              |
| `order`    | Sorting direction     | `?order=asc`                 |
| `status`   | Filter by item status | `?status=approved`           |

**Sorting examples:**

```http
GET /menu-items?sortBy=price&order=asc
GET /menu-items?sortBy=price&order=desc
```


### Challenge 2: JWT & Protected API Middleware

JWT verification protects sensitive backend operations.

**Implementation flow:**

```text
Client Request
      |
      v
Authorization Header
      |
      v
JWT Verification
      |
      v
User Authentication
      |
      v
Account Status Check
      |
      v
Role Authorization
      |
      v
Resource Ownership Check
      |
      v
Controller / Database Operation
      |
      v
API Response
```

Invalid or expired tokens receive a `401 Unauthorized` response.

Authenticated users without the required role receive a `403 Forbidden` response.

Frontend role checks are used for navigation and user experience, but backend authorization remains the actual security boundary.

### Challenge 3: Stripe Checkout & Webhook Verification

Vendor subscriptions use Stripe Checkout.

The backend creates checkout sessions and verifies webhook signatures before updating subscription information.

**Payment flow:**

```text
Vendor Requests Premium
          |
          v
Backend Validates Vendor
          |
          v
Stripe Checkout Session
          |
          v
Stripe Payment Processing
          |
          v
Stripe Webhook Event
          |
          v
Signature Verification
          |
          v
Payment Confirmation
          |
          v
MongoDB Transaction Record
          |
          v
Premium Subscription Activation
```

The frontend success page is not treated as proof of payment.

Premium access is granted only after a valid payment confirmation from Stripe.

---

## 🛠️ Technology Stack

### Frontend

| Technology     | Purpose                        |
| -------------- | ------------------------------ |
| Next.js 16     | React framework and App Router |
| React 19       | Component-based UI             |
| JavaScript     | Application programming        |
| Tailwind CSS 4 | Utility-first styling          |
| ShadCN UI      | Reusable UI components         |
| Radix UI       | Accessible UI primitives       |
| Base UI        | Additional UI components       |
| Lucide React   | Icons                          |
| Framer Motion  | Animations                     |
| Recharts       | Dashboard charts               |
| Better Auth    | Authentication client          |
| Sonner         | Toast notifications            |
| React Compiler | React optimization support     |

### Frontend NPM Packages

```text
next
react
react-dom
better-auth
@base-ui/react
@radix-ui/react-alert-dialog
@radix-ui/react-avatar
@radix-ui/react-checkbox
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-label
@radix-ui/react-select
@radix-ui/react-separator
@radix-ui/react-slot
@radix-ui/react-switch
@radix-ui/react-tabs
@radix-ui/react-tooltip
tailwindcss
@tailwindcss/postcss
@tailwindcss/turbopack
shadcn
lucide-react
framer-motion
recharts
sonner
clsx
class-variance-authority
tailwind-merge
date-fns
next-themes
stripe
```

### Backend

| Technology             | Purpose                         |
| ---------------------- | ------------------------------- |
| Node.js                | JavaScript runtime              |
| Express.js             | REST API framework              |
| MongoDB                | NoSQL database                  |
| MongoDB Node.js Driver | Database connectivity           |
| JOSE                   | JWT verification                |
| Stripe                 | Subscription payment processing |
| CORS                   | Cross-origin request handling   |
| dotenv                 | Environment variable management |

### Backend NPM Packages

```text
express
mongodb
jose
stripe
cors
dotenv
```

### External Services

| Service       | Purpose                      |
| ------------- | ---------------------------- |
| MongoDB Atlas | Cloud database               |
| Better Auth   | Authentication               |
| Google OAuth  | Social login                 |
| ImgBB         | Menu image hosting           |
| Stripe        | Vendor subscription payments |
| Vercel        | Frontend deployment          |
| Render        | Backend deployment           |

---


## 🚀 Installation & Local Development

### Prerequisites

Install the following before running the application:

- Node.js (LTS recommended)
- npm
- Git
- MongoDB Atlas account
- Google Cloud OAuth credentials
- ImgBB API key
- Stripe account for subscription testing

### 1. Clone the Repositories

```bash
git clone https://github.com/khorshedjhoni/pizzahub-client.git

git clone https://github.com/khorshedjhoni/pizzahub-server.git
```

### 2. Install Client Dependencies

```bash
cd pizzahub-client

npm install
```

### 3. Install Server Dependencies

Open another terminal:

```bash
cd pizzahub-server

npm install
```

### 4. Configure Environment Variables

Create `.env.local` inside the client repository and `.env` inside the server repository.

Use the environment variable names documented below and match them with the actual application configuration.

### 5. Run the Backend

```bash
cd pizzahub-server

npm run dev
```

The Express server runs on the configured backend port.

### 6. Run the Frontend

Open another terminal:

```bash
cd pizzahub-client

npm run dev
```

Open:

```text
http://localhost:3000
```

### 7. Production Build

To check the frontend production build:

```bash
cd pizzahub-client

npm run build
```

To run the production frontend:

```bash
npm start
```

---


## 👨‍💻 Developer

**Khorshed Alam**

Full-Stack Web Developer | Learning and Building with the MERN Stack

Interested in building modern web applications, solving programming problems, and developing secure, scalable, user-friendly software.

### Connect

- GitHub: [https://github.com/khorshedjhoni](https://github.com/khorshedjhoni)

---



<p align="center">
  <strong>🍕 PizzaHub — Discover. Order. Enjoy.</strong>
</p>

<p align="center">
  Fresh Pizza • Local Restaurants • Better Experiences
</p>
