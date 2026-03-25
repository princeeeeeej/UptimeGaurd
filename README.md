<div align="center">

# ⚡ UptimeGuard

### Real-Time Website Monitoring & Incident Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green?style=for-the-badge)](https://orm.drizzle.team/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

**A production-style uptime monitoring platform for websites, APIs, and services with intelligent alerting, SSL tracking, incident history, and a real-time dashboard.**

[Features](#-features) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure)

</div>

---

## 📌 Overview

**UptimeGuard** is a full-stack monitoring platform built to track service availability, record performance metrics, detect downtime, manage incidents, and notify users when their systems fail.

It was designed as a practical, production-inspired project that demonstrates:

- scalable full-stack architecture
- background worker processing
- modern TypeScript-first development
- database-driven monitoring workflows
- responsive dashboard design
- structured API design
- authentication and user-based data isolation

---

## ✨ Features

### 🔍 Monitoring
- Monitor websites and APIs using HTTP/HTTPS
- Track response times and availability
- Store historical ping results
- Display last known status in real time

### 📊 Dashboard
- Overview cards for:
  - total monitors
  - currently up
  - currently down
- responsive monitor cards
- uptime bar visualization
- quick actions like pause/resume and delete

### 📈 Monitor Detail View
- dedicated detail page for each monitor
- response time chart
- recent checks list
- SSL status panel
- incident history section

### 🚨 Alerting
- email alerts for downtime events
- recovery alerts when service comes back online
- SSL expiry alert support
- alert suppression / deduplication logic

### 🔒 SSL Monitoring
- certificate validity checks
- expiry tracking
- issuer visibility
- warning indicators for expiring certificates

### 🧠 Incident Tracking
- automatic incident creation
- active incident banner
- downtime history
- resolved vs ongoing incident states

### 🔐 Authentication
- Clerk-based auth
- user-specific monitors and data isolation
- protected dashboard and API access

### ⚙️ Background Processing
- separate worker process for monitor checks
- decoupled from frontend request lifecycle
- enables continuous monitoring independently of UI traffic

---

## 🏗️ Architecture

UptimeGuard is built around three main layers:

### 1. Frontend Application
Built with **Next.js App Router**, responsible for:
- dashboard UI
- monitor management
- charts and visualizations
- authentication-aware pages

### 2. API Layer
Implemented using **Next.js Route Handlers**, responsible for:
- monitor CRUD operations
- fetching incidents
- retrieving ping results
- exposing SSL data
- debug/testing endpoints

### 3. Background Worker
A standalone worker process continuously handles:
- scheduled monitor checks
- saving ping results
- creating/resolving incidents
- triggering alert emails
- SSL validation checks

### High-Level Flow
User → Next.js UI → API Routes → PostgreSQL<br />
                         ↑<br />
                         │<br />
                  Background Worker<br />
                         │<br />
                         ├─ Monitor Checks<br />
                         ├─ Incident Updates<br />
                         ├─ Email Alerts<br />
# 🛠 Tech Stack
** Frontend**
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts
  
**Backend**
- Next.js Route Handlers
- Drizzle ORM
- PostgreSQL
- Auth & Communication
- Clerk for authentication
- Resend for email alerts
- Background Jobs
- Custom worker process (worker/simple-worker.ts)


# 📁 Project Structure

app<br />
├── api<br />
│   ├── debug<br />
│   │   ├── results<br />
│   │   │   └── route.ts<br />
│   │   ├── test-alerts<br />
│   │   │   └── route.ts<br />
│   │   └── route.ts<br />
│   ├── incidents<br />
│   │   └── route.ts<br />
│   ├── monitors<br />
│   │   ├── [id]<br />
│   │   │   └── route.ts<br />
│   │   └── route.ts<br />
│   ├── results<br />
│   │   └── [monitorId]<br />
│   │       └── route.ts<br />
│   └── ssl<br />
│       └── [monitorId]<br />
│           └── route.ts<br />
├── dashboard<br />
│   ├── _component<br />
│   │   ├── AddMonitorModal.tsx<br />
│   │   ├── DashboardHeader.tsx<br />
│   │   ├── DashboardNav.tsx<br />
│   │   ├── DashboardSkeleton.tsx<br />
│   │   ├── MonitorCard.tsx<br />
│   │   ├── MonitorsGrid.tsx<br />
│   │   └── StatsGrid.tsx<br />
│   └── page.tsx<br />
├── monitors<br />
│   └── [id]<br />
│       ├── _component<br />
│       │   ├── IncidentBanner.tsx<br />
│       │   ├── IncidentHistory.tsx<br />
│       │   ├── MonitorDetailSkeleton.tsx<br />
│       │   ├── MonitorHeader.tsx<br />
│       │   ├── RecentChecks.tsx<br />
│       │   ├── ResponseChart.tsx<br />
│       │   ├── SSLCard.tsx<br />
│       │   └── StatsOverview.tsx<br />
│       └── page.tsx<br />
├── favicon.icon<br />
├── globals.css<br />
├── layout.tsx<br />
└── page.tsx<br />
<br />
components<br />
├── ui<br />
│   ├── button.tsx<br />
│   └── tooltip.tsx<br />
├── Cards.tsx<br />
├── Footer.tsx<br />
├── HeroSection.tsx<br />
└── WhySection.tsx<br />
<br />
worker<br />
└── simple-worker.ts<br />
⚙️ Worker Service<br />
Unlike many monitoring tools that depend on cron-based route triggers, UptimeGuard uses a dedicated worker process.<br />

# Why this approach?
keeps monitoring independent from frontend requests
simplifies local development
gives more control over execution logic
mirrors how real-world background services are often structured
Responsibilities of the worker
fetch active monitors from database
run checks against target URLs
measure response times
persist ping results
create or resolve incidents
send alert emails
perform SSL checks
Worker Entry Point
worker/simple-worker.ts<br />

## 🗄 Database Design<br />
The system is centered around monitoring entities and their operational history.

# Core tables
- monitors
- ping_results
- incidents
- ssl_checks
- alert_channels
- root_cause_analyses
- Main relationships
- one user can own many monitors
- one monitor can have many ping results
- one monitor can have many incidents
- one monitor can have many SSL checks
- This schema allows the platform to preserve operational history and support future analytics features.

# 📡 API Reference
- Monitor APIs
- Method	Endpoint	Description
- GET	/api/monitors	Fetch all monitors for current user
- POST	/api/monitors	Create a new monitor
- PATCH	/api/monitors/[id]	Update a monitor
- DELETE	/api/monitors/[id]	Delete a monitor
- Result APIs
- Method	Endpoint	Description
- GET	/api/results/[monitorId]	Fetch ping results for a monitor
- Incident APIs
- Method	Endpoint	Description
- GET	/api/incidents	Fetch incidents
- SSL APIs
- Method	Endpoint	Description
- GET	/api/ssl/[monitorId]	Fetch SSL data for a monitor
- Debug APIs
M- ethod	Endpoint	Description
- GET	/api/debug	Debug endpoint
- GET	/api/debug/results	Debug monitor results
- /api/debug/test-alerts	Trigger / test alerts
- 
# 🚀 Getting Started<br />
Prerequisites- Node.js 18+, PostgreSQL database, Clerk account, Resend account

**1. Clone the repository**<br />
git clone https://github.com/yourusername/uptimeguard.git
cd uptimeguard

**2. Install dependencies**<br />
npm install

**3. Configure environment variables**<br />
Create a .env.local file:
DATABASE_URL=your_postgres_connection_url

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

RESEND_API_KEY=your_resend_api_key

NEXT_PUBLIC_APP_URL=http://localhost:3000

**4. Push database schema**<br /> 
npm run db:push

**5. Start the Next.js app<br />**
npm run dev

**6. Start the worker**<br />
In a separate terminal:
npm run worker


**💡 Development Notes**<br />
Local development requires two processes
Because monitor execution is handled by a separate worker, you should run:
npm run dev
npm run worker
Recommended improvement

For production, the worker can be deployed separately using:

- Railway
- Render
- Fly.io
- Docker container
- VPS process manager like PM2


**🎨 UI Highlights**
- warm neutral color system for polished visual identity
- responsive dashboard optimized for desktop and mobile
- modular component architecture
- skeleton states for smoother perceived performance
- clean card-based layout for monitor summaries and details


**📈 Engineering Highlights**
This project demonstrates practical experience with:

- component-driven frontend architecture
- file-based routing with Next.js App Router
- background job design using a worker process
- TypeScript-based API development
- database modeling with Drizzle ORM
- auth-protected multi-user apps
- email notification workflows
- real-time dashboard UX patterns
- reusable UI composition and maintainable code structure

**🔮 Future Improvements**
- Slack / Discord / Telegram alerts
- public status pages
- multi-region checks
- retry & backoff policies
- role-based team access
- webhook integrations
- advanced analytics & trends
- queue-based worker scaling

**👨‍💻 Author**
Prince Jaiswal

If you like this project, feel free to connect or reach out.

- GitHub: https://github.com/princeeeeeej
- LinkedIn: https://www.linkedin.com/in/prince-jaiswal-2386702a1
- Portfolio: https://portfolio-hazel-phi-73.vercel.app/

**📄 License**

This project is licensed under the MIT License.

<div align="center">
Built with precision, designed for reliability.

If you found this project useful, consider giving it a ⭐
</div>
