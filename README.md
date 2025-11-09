# 🎧 Audiophile E-Commerce Website

A premium, pixel-perfect e-commerce platform for high-end audio equipment built with Next.js, Convex, and modern web technologies.

![Audiophile](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Convex](https://img.shields.io/badge/Convex-Backend-orange?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Author](#author)
- [License](#license)

## 🎯 Overview

Audiophile is a full-stack e-commerce website specializing in premium audio equipment including headphones, speakers, and earphones. The project features a modern, responsive design with a complete checkout flow, real-time order management, and automated email confirmations.

## ✨ Features

### 🛍️ E-Commerce Functionality

- **Product Catalog**: Browse headphones, speakers, and earphones with detailed product pages
- **Shopping Cart**: Real-time cart management with persistent storage
- **Checkout Flow**: Complete checkout process with form validation
- **Order Confirmation**: Beautiful confirmation pages with order summaries

### 🎨 Design & UX

- **Pixel-Perfect Design**: Faithfully implements the Audiophile Figma design
- **Responsive Layout**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Clean, minimalist design with smooth transitions
- **Accessibility**: Screen-reader friendly with proper ARIA labels

### 🔧 Technical Features

- **Real-time Database**: Convex backend for instant data synchronization
- **Email Notifications**: Automated order confirmation emails via Resend
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized images and server-side rendering
- **Cart Persistence**: Local storage integration for cart data

## 🛠️ Tech Stack

### Frontend

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Backend & Database

- **[Convex](https://www.convex.dev/)** - Real-time backend platform
- **[Resend](https://resend.com/)** - Transactional email service

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Convex account ([Sign up](https://dashboard.convex.dev/))
- Resend API key ([Sign up](https://resend.com/))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/audiophile-ecommerce.git
cd audiophile-ecommerce
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up Convex**

```bash
npx convex dev
```

This will create a new Convex project and generate your `NEXT_PUBLIC_CONVEX_URL`

4. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud

# Resend (for email notifications)
BREVO_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=Audiophile <onboarding@resend.dev>
SUPPORT_EMAIL=support@audiophile.com

# App URL (for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
audiophile-ecommerce/
├── app/
│   ├── api/
│   │   ├── orders/
│   │   │   └── route.ts          # Order fetching API
│   │   └── send-email/
│   │       └── route.ts          # Email sending API
│   ├── components/
│   │   ├── Cart.tsx              # Shopping cart component
│   │   ├── CartProvider.tsx      # Cart context & logic
│   │   ├── CheckoutForm.tsx      # Checkout form with validation
│   │   ├── Footer.tsx            # Footer component
│   │   ├── Header.tsx            # Header/navigation
│   │   └── ProductCard.tsx       # Product card component
│   ├── checkout/
│   │   └── page.tsx              # Checkout page
│   ├── confirmation/
│   │   └── page.tsx              # Order confirmation page
│   ├── data/
│   │   └── products.ts           # Product catalog data
│   ├── earphones/
│   │   └── page.tsx              # Earphones category page
│   ├── headphones/
│   │   └── page.tsx              # Headphones category page
│   ├── product/
│   │   └── [slug]/
│   │       └── page.tsx          # Dynamic product detail page
│   ├── speakers/
│   │   └── page.tsx              # Speakers category page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── convex/
│   ├── orders.ts                 # Order mutations & queries
│   ├── schema.ts                 # Database schema
│   └── _generated/               # Convex generated files
├── public/
│   └── images/                   # Product images & assets
├── styles/
│   └── globals.css               # Global styles
├── .env.local                    # Environment variables (create this)
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## 🔑 Environment Variables

| Variable                 | Description                       | Required       |
| ------------------------ | --------------------------------- | -------------- |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL             | ✅ Yes         |
| `BREVO_API_KEY`          | Resend API key for sending emails | ✅ Yes         |
| `FROM_EMAIL`             | Email sender address              | ⚠️ Recommended |
| `SUPPORT_EMAIL`          | Customer support email            | ⚠️ Recommended |
| `NEXT_PUBLIC_APP_URL`    | App URL (for production links)    | ⚠️ Recommended |

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy Convex Backend

```bash
npx convex deploy
```

This will deploy your Convex backend and give you a production URL.

### Important: Update Environment Variables

After deploying Convex, update your Vercel environment variables with the production Convex URL.

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npx convex dev       # Start Convex development backend

# Production
npm run build        # Build for production
npm start            # Start production server
npx convex deploy    # Deploy Convex backend

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🎨 Design Reference

This project is based on the [Audiophile E-commerce Figma Design](https://www.figma.com/community/file/1246393316245131849). All designs are implemented pixel-perfectly across mobile, tablet, and desktop breakpoints.

## 🔒 Features Breakdown

### Shopping Cart

- Add/remove items
- Update quantities
- Persistent storage (localStorage)
- Real-time price calculations
- Shipping & tax calculations

### Checkout Process

1. **Form Validation**
   - Name, email, phone validation
   - Address validation
   - Inline error messages
   - Accessibility support

2. **Order Processing**
   - Save order to Convex database
   - Send confirmation email
   - Clear cart on success
   - Redirect to confirmation page

3. **Order Confirmation**
   - Display order summary
   - Show shipping details
   - List all purchased items
   - Show totals breakdown

### Product Pages

- Dynamic routing by slug
- Image galleries
- Product features
- "In the box" items list
- Related products
- Add to cart functionality

## 🐛 Known Issues & Limitations

- Payment integration not yet implemented (checkout flow ready for integration)
- Product images must be added to `/public/images/` directory
- Email templates are basic HTML (can be enhanced with React Email)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Samuel Onyedikachi (Psalmcodes)**

- GitHub: [@Psalmcodes](https://github.com/Psalmcodes)
- Twitter: [@Psalmcodes](https://twitter.com/Psalmcodes)
- LinkedIn: [Psalmcodes](https://linkedin.com/in/Psalmcodes)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from [Frontend Mentor](https://www.frontendmentor.io/)
- Product images and content from the Audiophile design challenge
- Built as part of the HNG12 Frontend Track Stage 3 task

## 📞 Support

If you have any questions or need help with the project, feel free to:

- Open an issue on GitHub
- Reach out on Twitter [@Psalmcodes](https://twitter.com/Psalmcodes)
- Email: [your-email@example.com](mailto:your-email@example.com)

---

**Made with ❤️ by Samuel Onyedikachi (Psalmcodes)**

⭐ If you found this project helpful, please consider giving it a star on GitHub!
