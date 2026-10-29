# ShopSphere

**A Full-Stack Multi-Vendor E-Commerce Platform**

ShopSphere is a multi-vendor e-commerce application built with Next.js and TypeScript. It provides separate experiences for customers, sellers, and administrators, with features for product discovery, shopping cart management, order placement, seller product management, and seller account administration.

## Key Features

### Customer Storefront

- Browse and search for products.
- Explore products by category.
- View individual product details.
- Manage a shopping cart.
- Add and manage delivery addresses.
- Proceed through the checkout flow and place orders.
- Register for an account with OTP verification.
- Sign in and manage a personal profile.

### Seller Dashboard

- Access a dedicated seller area.
- Create and manage product listings.
- Edit existing products.
- Manage product categories.
- View seller-related messages.
- Access password recovery and password setup pages.
- Upload product images through the application's upload API.

### Admin Dashboard

- Access a dedicated administration area.
- Review seller registration requests.
- Accept or reject seller requests.
- Manage seller accounts.
- Delete seller accounts when necessary.
- Handle seller-related administrative actions.

### Backend and API

- Next.js App Router API routes.
- Authentication integration with NextAuth.js.
- MongoDB data models managed with Mongoose.
- Product search and category-based product retrieval.
- Product creation, deletion, and upload endpoints.
- Order status management.
- Address deletion.
- User registration and OTP verification endpoints.
- Seller account and seller-message management endpoints.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React | User interfaces |
| TypeScript | Static typing |
| MongoDB | Database |
| Mongoose | Database models and data access |
| NextAuth.js | Authentication |
| Tailwind CSS | Styling |
| shadcn/ui components | UI component foundation |
| Base UI | UI primitives |
| Axios | HTTP requests |
| Nodemailer | Email functionality |
| bcryptjs | Password hashing utilities |
| Lucide React | Icons |

## Project Structure

```text
shoply-app/
├── app/
│   ├── (user)/       # Customer-facing pages
│   ├── admin/        # Admin dashboard
│   ├── api/          # API route handlers
│   ├── seller/       # Seller dashboard
│   ├── actions/      # Server-side actions
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── home/         # Storefront components
│   ├── seller/       # Seller components
│   └── ui/           # Reusable UI components
├── features/         # Product and upload utilities
├── lib/              # Authentication, database, utilities
├── models/           # MongoDB/Mongoose models
├── public/           # Static assets
├── scripts/          # Project scripts
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- A MongoDB database
- The environment variables required by the application

### 1. Clone the repository

```bash
git clone https://github.com/Mahmoud-nassar777/ShopSphere.git
cd ShopSphere
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the environment variables required by your local configuration.

Typical integrations may require database connection details, authentication secrets, and email configuration. Check the application's configuration files to confirm the exact variable names and required values.

**Never commit `.env.local` or publish credentials, API keys, authentication secrets, or database connection strings.**

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
```

To start the production server after a successful build:

```bash
npm run start
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Database Models

The project includes Mongoose models for:

- Users
- Products
- Categories
- Shopping carts
- Orders
- Addresses
- Seller messages

## Security Notes

- Keep environment variables and secrets out of version control.
- Use strong authentication secrets in deployed environments.
- Ensure sensitive API operations enforce appropriate authentication and authorization.
- Never expose database credentials or email service credentials in client-side code.

## Project Status

ShopSphere is a full-stack e-commerce project with customer, seller, and administrator sections. Setup requirements and available functionality may vary according to the current implementation and environment configuration.

## Repository

GitHub: [Mahmoud-nassar777/ShopSphere](https://github.com/Mahmoud-nassar777/ShopSphere)
