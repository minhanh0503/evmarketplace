# EV Marketplace — A Cloud-Native Electric Vehicle E-Commerce Platform

EECS 4413 (Building E-Commerce Systems) — Team Project, Summer 2026

EV Marketplace is a full-stack e-commerce application for browsing, comparing, financing,
and purchasing electric vehicles, plus booking test drives and chatting with a support
assistant. The system is built as a layered modular monolith (Spring Boot) with a React SPA
front end, deployed cloud-natively with a managed PostgreSQL database.

**Live demo:**
- Frontend: https://evmarketplace.vercel.app
- Backend API: https://evmarketplace-backend.onrender.com

**Team members:**
- Kiana Misaghi — Identity/Auth backend, login/register frontend
- Minh Anh Nguyen — Vehicle catalogue, homepage, CarDetails frontend, reviews/ratings, vehicle comparison, customization
- Tazwar Sikder — Shopping Cart, Checkout, Payment, deployment infrastructure, security fixes, performance testing, loan calculator, order history
- Matin Pakfetrat — Chatbot, test drive booking frontend, hot deals, admin reports, analytics

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [Getting Started (Local Setup)](#getting-started-local-setup)
- [Deployment](#deployment)
- [Testing](#testing)
- [API Overview](#api-overview)
- [Known Limitations](#known-limitations)
- [Documentation](#documentation)

---

## Architecture

The system follows a three-tier, layered client–server architecture based on the
Model-View-Controller (MVC) pattern:

- **Presentation tier** — React (Vite) single-page application, hosted on Vercel.
- **Business tier** — a single Spring Boot application (modular monolith) organized into
  cohesive packages: identity, catalog, cart/order/payment, test drive, analytics,
  notification, and chatbot. Hosted on Render (Docker).
- **Data tier** — managed PostgreSQL (Neon), accessed exclusively through Spring Data JPA
  repositories.

The frontend never talks to the database directly — all reads/writes go through the REST
API. Although the codebase is organized as independent service packages (each with its own
controller/service/repository), it is deployed as a single Spring Boot process rather than as
separately deployed microservices, given the project timeline.

Key architectural decisions:
- **Repository pattern** — isolates persistence (Spring Data JPA) from business logic.
- **DTO pattern** — request/response bodies (e.g. `AddToCartRequest`, `CheckoutRequest`,
  `VehicleSearchRequest`) decouple the wire format from internal entities.
- **Strategy pattern** — used for vehicle sorting/filtering (price, mileage, ascending/descending).
- **Snapshot pattern for pricing** — `CartItem` stores a server-resolved unit price at
  add-to-cart time; `OrderItem` copies that snapshot at checkout, so catalogue price changes
  never silently affect items already in a cart or order.
- **Serializable transaction isolation** — test drive booking runs at
  `Isolation.SERIALIZABLE` to prevent double-booking the same vehicle/time slot.

See the full design document (`EECS4413 Team I Deliverable 3 report`) for detailed
component, deployment, and sequence diagrams.

---

## Tech Stack

**Backend**
- Java 21, Spring Boot, Spring Web (REST), Spring Data JPA, Hibernate
- PostgreSQL (Neon, managed, TLS)
- BCrypt password hashing (with backward-compatible plaintext-to-hash upgrade on login)
- Docker (backend container image)

**Frontend**
- React (Vite), React Router
- Tailwind CSS
- Native Fetch API via thin service modules (`VehicleService.jsx`, `CartService.jsx`,
  `OrderService.jsx`, `TestDriveService.jsx`, etc.)
- `react-calendar` for test drive date selection

**Infrastructure / Deployment**
- Backend: Render (Docker), automatic HTTPS
- Frontend: Vercel, automatic HTTPS
- Database: Neon managed PostgreSQL

**Testing**
- Apache JMeter (load/performance testing)
- Manual security test cases (SQL injection, XSS)
- curl / REST test scripts

---

## Features

**Customer-facing**
- Register / log in / log out
- Browse, search, filter (brand, shape, model year, price, mileage, accident history), and
  sort (price/mileage, ascending/descending) the vehicle catalogue
- View vehicle details, including specs and vehicle history
- Compare two or more vehicles side by side
- Customize a vehicle (paint, wheels, etc.)
- Loan calculator (standalone financing estimator — not wired into checkout payment)
- Shopping cart: add, update quantity, remove, view running total (with HST)
- Checkout with simulated payment authorization and a printable receipt
- Order history
- Write reviews and star ratings
- View hot deals
- Book a test drive (date/time slot picker, conflict-safe booking, cancel bookings)
- Chat with a support chatbot (catalog-grounded responses for hot deals / vehicle search,
  plus quick-reply suggestion chips)

**Admin-facing**
- Monthly vehicle sales reports
- Website usage / analytics reports (view, cart, purchase events)

---

## Project Structure

```
evmarketplace/
├── backend/
│   └── src/
│       ├── main/java/com/evmarketplace/
│       │   ├── model/         # JPA entities (Vehicle, User, CartItem, Order, OrderItem, Payment, TestDriveBooking, VisitEvent, Notification, ...)
│       │   ├── controller/    # REST controllers (VehicleController, CartController, OrderController, IdentityController, TestDriveController, AdminReportController, NotificationController, ChatbotController, VehicleReviewController, ...)
│       │   ├── service/       # Business logic per module
│       │   ├── repository/    # Spring Data JPA repositories
│       │   └── dto/           # Request/response DTOs
│       └── test/jmeter/       # EVMarketplace_LoadTest.jmx (performance test plan)
├── frontend/
│   └── src/
│       ├── pages/             # Home, Cart, Checkout, TestDrive, OrderHistory, LoanCalculator, HotDeals, Login, Register, CarDetails, ...
│       ├── components/        # CarCard, CarFilter, SearchBar, ChatWidget, Navbar, ...
│       └── services/          # Fetch-based API clients (VehicleService.jsx, CartService.jsx, OrderService.jsx, TestDriveService.jsx, ...)
└── README.md
```

---

## Design Patterns

| Pattern | Where used | Why |
|---|---|---|
| Repository | `*Repository` interfaces extending `JpaRepository` | Decouples business logic from persistence; enables mocked tests |
| DTO | `AddToCartRequest`, `CheckoutRequest`, `VehicleSearchRequest`, `TestDriveBookingRequest`, `VisitEventRequest` | Decouples wire format from entity model |
| Strategy | Vehicle sorting/filtering | New sort/filter criteria can be added without touching existing logic |
| MVC | Controller → Service → Repository → Database | Standard separation of concerns across the whole backend |
| Singleton | Spring-managed `@Service`/`@Component` beans | Single instance, global access, consistent state |
| Snapshot | `CartItem.unitPrice`, `OrderItem` price copy | Prevents catalogue price changes from retroactively altering carts/orders |

---

## Getting Started (Local Setup)

### Prerequisites
- Java 21+
- Node.js 18+ and npm
- A PostgreSQL instance (local or a free Neon project) — or Docker

### Backend

```bash
cd backend
# Configure database credentials via environment variables (do not commit secrets):
#   SPRING_DATASOURCE_URL
#   SPRING_DATASOURCE_USERNAME
#   SPRING_DATASOURCE_PASSWORD
./mvnw spring-boot:run
```

The API will start on `http://localhost:8080` by default.

To run via Docker instead:

```bash
cd backend
docker build -t evmarketplace-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=<your-db-url> \
  -e SPRING_DATASOURCE_USERNAME=<user> \
  -e SPRING_DATASOURCE_PASSWORD=<password> \
  evmarketplace-backend
```

### Frontend

```bash
cd frontend
npm install
# Set the backend API base URL for local development, e.g. in a .env file:
#   VITE_API_URL=http://localhost:8080
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite default).

---

## Deployment

The application is deployed cloud-natively:

- **Backend** — containerized (Docker) Spring Boot app deployed on **Render**, with
  automatic HTTPS/TLS provisioning.
- **Frontend** — React/Vite build deployed on **Vercel**, with automatic HTTPS/TLS
  provisioning.
- **Database** — managed PostgreSQL on **Neon**, accessed over TLS.

An earlier attempt to deploy on **AWS Elastic Beanstalk** was abandoned: the AWS Academy
Learner Lab account's IAM restrictions blocked both CloudFront distribution creation and S3
bucket creation (the two AWS-native paths to HTTPS), returning an explicit
`cloudfront:CreateDistribution` access-denied error. Render + Vercel were adopted instead as
a more practical path to a fully HTTPS-hosted, cloud-native deployment within the course
timeline.

---

## Testing

- **Functional / TDD test cases** — 17+ test cases covering identity, catalogue, cart,
  checkout/payment, test drive booking, reviews, and admin reporting (see the Deliverable 3
  design document, Section 10, for full test case tables and results).
- **Security testing**:
  - SQL injection — verified that Spring Data JPA's parameterized queries reject injection
    payloads in the login form (no raw/native SQL string concatenation anywhere in the
    identity module).
  - Cross-site scripting (XSS) — verified that React's default JSX escaping renders
    `<script>` payloads submitted via the review form as literal text rather than executing
    them.
- **Performance / load testing** — Apache JMeter test plan
  (`backend/src/test/jmeter/EVMarketplace_LoadTest.jmx`) run against the live Render-hosted
  `GET /api/vehicles` endpoint at 1, 5, 10, 25, and 50 concurrent threads (10 loops each,
  750 requests total). Result: **0% errors at every concurrency level tested**, with response
  time growing roughly 4x and throughput growing roughly 9x from 1 to 50 threads.

---

## API Overview

All endpoints are resource-oriented REST, returning/accepting JSON, and stateless (no
server-side session state between requests).

| Module | Base path | Notes |
|---|---|---|
| Catalog | `/api/vehicles` | Browse, search, filter, sort, hot deals, comparison |
| Identity | `/api/auth` | Register, login, logout, session validation (BCrypt-hashed passwords) |
| Shopping Cart | `/api/cart` | Add, view, update, remove items; server-resolved pricing |
| Ordering / Payment | `/api/orders` | Checkout, simulated payment authorization, order history |
| Test Drive | `/api/test-drives` | Availability, booking (SERIALIZABLE isolation), cancellation |
| Reviews | `/api/reviews` | Submit and view vehicle reviews/ratings |
| Admin Reports | `/api/admin/reports` | Sales report, usage report (VIEW/CART/PURCHASE events) |
| Notifications | `/api/notifications` | Order/booking confirmation records (logged server-side, not sent as real email) |
| Chatbot | `/api/chatbot` | Rule-based intent matching with live catalog-grounded responses |

**Simulated payment rule:** the first two consecutive checkout attempts for a given user are
approved; every third consecutive attempt is denied (persisted via a `payments` table count,
not an in-memory counter, so the rule survives restarts and is consistent under scaling).

---

## Known Limitations

- Admin reporting endpoints do not yet have production-grade role-based authorization
  guards; session tokens are also not yet persisted in a revocable store.
- The Loan Calculator is a standalone estimation tool and is not wired into the actual
  checkout/payment flow.
- Vehicle body-type and accident-history data is seeded manually rather than sourced from a
  real third-party vehicle history provider.
- Notifications (order/booking confirmations) are persisted and logged server-side but are
  not sent as real email/SMS.
- Render's free tier has a cold-start delay (~11s) after periods of inactivity; this is a
  platform characteristic, not an application performance issue (see the JMeter results
  above, which exclude cold-start timing).

---

## Documentation

The complete project documentation is available in the project report.

- **Project Report:** [Project_Report.pdf](./Project_Report.pdf)

The report includes:
- System architecture
- UML diagrams (use case, sequence, package, component)
- Design patterns
- Sprint backlog and Gantt chart
- Testing and evaluation
- Deployment details
- Team reflections
