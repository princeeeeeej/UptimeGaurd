<div align="center">
  
# ⚡ UptimeGuard

### Real-Time Website Monitoring & Incident Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green?style=for-the-badge)](https://orm.drizzle.team/)

**Monitor your websites, APIs, and servers 24/7 with instant alerts and beautiful dashboards.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture)

</div>

---

## 🎯 Overview

**UptimeGuard** is a production-ready uptime monitoring platform built with modern technologies. It provides real-time monitoring, intelligent alerting, SSL certificate tracking, and incident management — all wrapped in a beautiful, responsive UI.

**Key Highlights:**
- 🔄 Real-time monitoring with configurable intervals
- 📧 Smart email alerts with deduplication
- 🔒 SSL certificate expiration tracking
- 📊 Beautiful charts and analytics
- 🎨 Clean, minimal UI design
- 📱 Fully responsive on all devices

---

## ✨ Features

### 📊 Real-Time Monitoring
- HTTP/HTTPS monitoring with configurable intervals
- Response time tracking with historical charts
- Uptime percentage calculation
- Auto-refresh dashboard (30-second intervals)

### 🚨 Smart Alerting System
- Instant email notifications when sites go down
- Recovery alerts when sites come back up
- Alert deduplication — no spam, just what matters
- Escalation system — reminders at 5, 15, 30, 60 minutes

### 🔒 SSL Certificate Monitoring
- Expiration tracking with days remaining
- Certificate details (issuer, protocol, validity)
- Early warning alerts before certificates expire
- Visual indicators (valid/warning/expired)

### 🔥 Incident Management
- Automatic incident creation on failures
- Root cause analysis with categorization
- Incident history with duration tracking
- Resolution tracking with downtime calculation

### 🎨 Beautiful Dashboard
- Clean, minimal design with warm aesthetics
- Fully responsive — works on all devices
- Real-time status indicators with animations
- Interactive charts using Recharts
- Skeleton loading states for better UX

### 🔐 Authentication
- Clerk integration for secure authentication
- User-specific monitors — data isolation
- Protected API routes

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Interactive data visualization |
| **Lucide Icons** | Beautiful icon library |
| **Clerk** | Authentication & user management |

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless API endpoints |
| **Drizzle ORM** | Type-safe database queries |
| **PostgreSQL** | Primary database |
| **Resend** | Transactional emails |
| **Vercel Cron** | Scheduled monitoring jobs |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **Vercel** | Deployment & hosting |
| **Neon/Supabase** | Managed PostgreSQL |
| **Resend** | Email delivery |

---

## 📁 Project Structure
uptimeguard/
├── app/
│ ├── api/
│ │ ├── monitors/
│ │ │ ├── route.ts
│ │ │ └── [id]/route.ts
│ │ ├── cron/route.ts
│ │ └── test-alert/route.ts
│ ├── dashboard/
│ │ ├── page.tsx
│ │ └── _components/
│ │ ├── DashboardNav.tsx
│ │ ├── StatsGrid.tsx
│ │ ├── MonitorCard.tsx
│ │ ├── MonitorsGrid.tsx
│ │ └── AddMonitorModal.tsx
│ ├── monitors/[id]/
│ │ ├── page.tsx
│ │ └── _components/
│ │ ├── MonitorHeader.tsx
│ │ ├── ResponseChart.tsx
│ │ ├── RecentChecks.tsx
│ │ ├── SSLCard.tsx
│ │ └── IncidentHistory.tsx
│ └── page.tsx
├── components/
│ ├── HeroSection.tsx
│ ├── WhySection.tsx
│ └── Footer.tsx
├── db/
│ ├── index.ts
│ └── schema.ts
├── lib/
│ ├── alerts.ts
│ └── utils.ts
└── public/

text


---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account
- Resend account

### Installation

1. **Clone the repository**
```bash
1.git clone https://github.com/yourusername/uptimeguard.git
cd uptimeguard

2.Install dependencies
npm install

3.Set up environment variables
cp .env.example .env.local

# Database
DATABASE_URL="postgresql://..."

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Resend Email
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CRON_SECRET="your-secret-key"
Set up the database

4.npm run db:push
Run the development server

5.npm run dev
Open http://localhost:3000


🗄️ Database Schema

monitors {
  id            UUID PRIMARY KEY
  user_id       VARCHAR NOT NULL
  name          VARCHAR NOT NULL
  url           VARCHAR NOT NULL
  interval      INTEGER DEFAULT 60
  is_active     BOOLEAN DEFAULT true
  created_at    TIMESTAMP
  updated_at    TIMESTAMP
}

ping_results {
  id            UUID PRIMARY KEY
  monitor_id    UUID REFERENCES monitors(id)
  status_code   INTEGER
  response_time REAL
  is_up         BOOLEAN NOT NULL
  error_message TEXT
  checked_at    TIMESTAMP
}

incidents {
  id            UUID PRIMARY KEY
  monitor_id    UUID REFERENCES monitors(id)
  started_at    TIMESTAMP
  resolved_at   TIMESTAMP
  cause         TEXT
}

ssl_checks {
  id                UUID PRIMARY KEY
  monitor_id        UUID REFERENCES monitors(id)
  is_valid          BOOLEAN NOT NULL
  issuer            VARCHAR
  days_until_expiry INTEGER
  checked_at        TIMESTAMP
}


🏗️ Architecture

┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  Dashboard  │  │  Monitor    │  │  Landing Page   │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────┘  │
└─────────┼────────────────┼──────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────┐
│                  NEXT.JS API ROUTES                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ /api/       │  │ /api/cron   │  │ /api/test-alert │  │
│  │ monitors    │  │             │  │                 │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
          ▼                ▼                  ▼
┌─────────────────┐  ┌─────────────┐  ┌───────────────────┐
│   PostgreSQL    │  │  External   │  │    Resend API     │
│   Database      │  │  Websites   │  │    (Email)        │
└─────────────────┘  └─────────────┘  └───────────────────┘