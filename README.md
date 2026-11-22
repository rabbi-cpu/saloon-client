# SalonBook — Luxury Studio & Appointment Booking Platform

**SalonBook** is a full-stack luxury salon appointment booking and studio management web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Better Auth**, **Express.js**, **MongoDB**, and **Stripe**.

---

## Live Links & Repositories

- **Live Client URL:** `https://your-salonbook-client.vercel.app`
- **Live Server API URL:** `https://saloon-server.vercel.app`
- **GitHub Profile:** [@rabbi-cpu](https://github.com/rabbi-cpu)

---

## Key Features

### Customer Experience
- **Service Catalog & Filtering:** Browse luxury salon treatments with real-time search, category filtering, and price sorting.
- **Smart Slot Booking:** Reserve appointments by selecting preferred dates and time slots with conflict prevention.
- **Secure Stripe Checkout:** Pay online seamlessly via Stripe Hosted Checkout Sessions and receive instant booking confirmation.
- **Transaction Tracking:** View and copy the Stripe Transaction ID (`TX ID`) directly from the customer dashboard.
- **Verified Reviews:** Submit ratings and reviews after completing a paid treatment.
- **Profile Management:** Update display name, phone number, and profile photo (via image URL or direct file upload) from the navbar dropdown.

### Admin Control Center
- **Dynamic Role Synchronization:** Admin privileges are automatically synced via environment configuration (`ADMIN_EMAILS`).
- **Service Management:** Create, edit, toggle active status, or delete salon treatments.
- **Appointment Oversight:** Confirm pending requests or cancel appointments across all customers.
- **Customer Moderation:** View registered customers and manage account access (Block / Unblock).
- **Payment Ledger:** Monitor all successful Stripe transactions and revenue statistics.

### Authentication & Security
- **Better Auth Integration:** Supports Email/Password authentication and Google OAuth social login.
- **Form Validation:** Enforces minimum 8-character password validation and includes a password reset request modal.
- **Protected Dashboards:** Role-based routing for `/dashboard/customer` and `/dashboard/admin`.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS, Lucide React, Axios, Sonner |
| **Authentication** | Better Auth (Email/Password + Google OAuth) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (`salonBookDB`) |
| **Payments** | Stripe Checkout & Webhooks |
| **Deployment** | Vercel |

---

## Environment Variables Setup

Create a `.env.local` file in the root of the client directory and configure the following variables:

```env
NEXT_PUBLIC_API_URL=[https://saloon-server.vercel.app](https://saloon-server.vercel.app)
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret_key
MONGODB_URI=your_mongodb_connection_string
DB_NAME=salonBookDB
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret