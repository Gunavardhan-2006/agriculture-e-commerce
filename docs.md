# AgriLink — Project Documentation (Beginner Guide)

> Read this if you are new to the project, new to web development, or you need
> to explain the product to your team. No prior knowledge of JavaScript,
> programming, or the web is assumed. We explain everything from zero.

---

## 1. What is this project?

**AgriLink** is a web application (a website with a working "brain") that lets
farmers list fresh produce — vegetables, fruits, grains, spices — and lets
buyers browse that produce, add it to a cart, and place orders for delivery.

Think of it as an online marketplace designed for agriculture, like a farmer's
market but on the internet. It is currently a **demo/prototype**: the core
plumbing works (accounts, login, listings, cart, checkout), but payments and
some data are simulated so the team can experiment safely.

The app was built with a single idea in mind:

> **Better prices start at the farm gate.**
> Farmers should sell closer to the source, and buyers should see fresh stock,
> honest delivery costs, and the people behind every order.

---

## 2. Why does this product exist? Where can it be used?

### The problem it solves

In traditional agriculture trade, a farmer's produce passes through several
middlemen before reaching a buyer. Each middleman takes a cut, so the farmer
gets less and the buyer pays more. Information (real prices, fresh stock) is
also hard to come by.

### Where it can be used

- **Farm-to-business**: restaurants, kirana (grocery) stores, hotels ordering
  fresh vegetables in bulk.
- **Government / FPOs** (Farmer Producer Organisations): helping farmer
  collectives publish stock and get better prices.
- **Local fairs / mandi digitalization**: a digital version of the regional
  produce market with transparent pricing.
- **Logistics companies**: matching farmers' deliveries to transporters.

### Why it's valuable

- **Price transparency** — buyers see regional price baselines before paying.
- **Less wastage** — produce is listed while fresh, so it is sold faster.
- **Access** — small farmers get a direct digital shop-front.
- **India-ready** — the interface is translated into Hindi, Telugu, Tamil,
  Kannada, and Marathi (see §6.8).

---

## 3. Architecture and flow — the big picture

Before learning any technology names, understand the _shape_ of the system.

```
                ┌────────────────────────────────────────────┐
                │              THE BROWSER (Client)          │
                │  The part the user sees and clicks.        │
                │  Pages: Home, Marketplace, Cart, Login ... │
                └──────────────────▲─────────────────────────┘
                                   │ 1. Browser asks for a page (URL)
                                   │ 2. Browser sends form data / API calls
                                   │ 3. Browser receives HTML, JSON, updates UI
                ┌──────────────────┴─────────────────────────┐
                │              THE APPLICATION SERVER         │
                │  Next.js web server - runs the business    │
                │  logic, checks "is this user allowed to    │
                │  do this?", accepts logins, orders, etc.   │
                └──────────────────▲─────────────────────────┘
                                   │ 4. Server reads/writes data
                ┌──────────────────┴─────────────────────────┐
                │            THE DATABASE (PostgreSQL)       │
                │  Permanent storage: users, sessions,       │
                │  orders, listings                          │
                └────────────────────────────────────────────┘
```

### What happens when a buyer uses the app (the full flow)

1. **Visit the homepage** — the browser asks the server for `/`. The server
   returns the HTML for the landing page. (In Next.js, code can run both on
   the server and in the browser — more on this in §6.)
2. **Browse the marketplace** — the buyer opens `/marketplace`. They see fresh
   produce cards. Today, most listing data comes from bundled **demo data** +
   a local browser store (this is the demo part).
3. **Add to cart** — clicking "Add to cart" saves the item into the browser's
   **localStorage** (a small storage area inside the browser). The cart icon
   badge updates instantly on every page because a shared "cart store" notifies
   all components.
4. **Sign up / Sign in** — the buyer creates an account. This is **real** — the
   credentials are stored in the PostgreSQL database via Better Auth (see §5).
   Passwords are hashed (scrambled one-way), never stored in plain text.
5. **Checkout** — the buyer fills delivery details and places the order. The
   server first _checks the session_ (is this person really logged in?) and
   returns **401 Unauthorized** if not. If allowed, the order is created.
   Payment is currently **simulated** for the demo.
6. **Track order** — the buyer (and later the farmer, the transporter) can see
   the order status: placed → confirmed → harvest & pack → handed to
   transporter → in transit → delivered.

### Important honest note for your team

This prototype mixes two kinds of storage:

| What                            | Real (Database)                   | Demo (browser localStorage / bundled data)              |
| ------------------------------- | --------------------------------- | ------------------------------------------------------- |
| User accounts, logins, sessions | ✅ Yes (Better Auth + PostgreSQL) |                                                         |
| Marketplace listings            |                                   | ✅ Yes (demo data + locally published listings)         |
| Cart                            |                                   | ✅ Yes (localStorage)                                   |
| Orders                          |                                   | ✅ Partly simulated                                     |
| Payments                        |                                   | ✅ Simulated                                            |
| Delivery cost estimates         |                                   | ✅ Calculated with a simple formula from demo distances |

The goal is: replace each "demo" box with a real database-backed feature over
time. The architecture is already set up for that (see §8 and §9).

---

## 4. Tech stack — every technology, explained simply

### 4.1 JavaScript (JS) — the language of the web

JavaScript is the programming language that web browsers understand. It is what
makes a page interactive (buttons, dropdowns, fetching data). Modern apps
"compile" (translate) higher-level code into JavaScript that browsers run.

### 4.2 TypeScript

TypeScript is JavaScript **plus types**. A _type_ is a rule like "this must be
a number" or "this must be an email address". The computer checks these rules
_before_ the app runs, which catches a whole class of mistakes (e.g. passing a
word where a number was expected). Think of it as a spell-checker for code.

### 4.3 React

React is a **UI library** (a tool to build user interfaces). With React, you
describe what the screen looks like by writing small building blocks called
**components** (e.g. `<Card>`, `<Navbar>`, `<LoginForm>`). React handles
updating the screen when data changes.

Two important React ideas you will hear:

- **State** — data a component remembers (e.g. is the login form loading?).
  When state changes, React re-renders (redraws) that part of the screen.
- **Props** — data passed to a component (like arguments to a function).

### 4.4 Next.js (App Router)

Next.js is a **framework built on top of React**. A framework provides the
scaffolding: file-based pages, API routes, performance optimizations, etc.

- **File-based routing**: every file inside `src/app/**/page.tsx` becomes a
  real URL. E.g. `src/app/marketplace/page.tsx` → the URL `/marketplace`.
- **Client vs Server components**: a file starting with `"use client"` runs in
  the browser (interactive things). Files without it run on the server (faster,
  safer). This split is called the **App Router** model.
- **API routes**: files inside `src/app/api/**/route.ts` are server "endpoints"
  that the browser calls with JSON. E.g. `/api/auth/sign-in`, `/api/orders`.

### 4.5 Tailwind CSS

Tailwind is how we _style_ (beautify) the app. Instead of writing long CSS
files, you add tiny utility classes directly on elements, like
`rounded-lg bg-emerald-700 text-white`. It is fast to write and keeps styling
close to the component.

### 4.6 Database — PostgreSQL (on Neon)

The permanent "memory" of the app. Data is stored in **tables** (like Excel
sheets with rows and columns):

- `auth_user` — accounts (name, email, etc.)
- `auth_session` — who is currently logged in
- `auth_account` — login methods per user (holds the hashed password)
- `users` — the app's business profile for each member (name, email, role)
- `listings` — produce for sale
- `orders`, `order_items` — purchases
- `payments`, `deliveries`, `reviews`, and more

### 4.7 Drizzle ORM

An **ORM** (Object Relational Mapper) is a translator between the database and
the programming language. Instead of writing raw SQL (the database's own
language) everywhere, we describe the database **schema** (the table
structures) in TypeScript files (`src/lib/db/schema.ts`) and Drizzle converts
our code into SQL. This keeps everything consistent and catches errors early.

### 4.8 Better Auth — the authentication system

Authentication = "prove who you are, then keep you logged in." Better Auth is
a ready-made authentication library that handles:

- **Sign up** — creating an account.
- **Sign in** — checking email + password and creating a **session**.
- **Sessions** — a secure "login ticket". When you log in, the server creates
  a session and sends the browser a cookie (a small piece of data the browser
  keeps and sends back on every request). This is how the server knows "the
  person sending this request is the logged-in user."
- **Log out** — deleting that session.

The whole authentication stack in this project:

| Layer                                               | Tool                                                                                    |
| --------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Auth library                                        | Better Auth (v1.7)                                                                      |
| Database adapter (translates Better Auth ↔ Drizzle) | `@better-auth/drizzle-adapter`                                                          |
| Tables in PostgreSQL                                | `auth_user`, `auth_session`, `auth_account`, `auth_verification`                        |
| Auth API endpoints                                  | `/api/auth/sign-in`, `/api/auth/sign-up`, `/api/auth/get-session`, ... (auto-generated) |
| Client helper                                       | `authClient` in `src/lib/authclient.ts` (`signIn`, `signUp`, `signOut`, `useSession`)   |
| Server helper                                       | `auth` in `src/lib/auth/auth.ts` (`auth.api.getSession`)                                |

### 4.9 Other utilities

- **zod** — validation. Defines "the shape a request must have" and rejects bad
  data (used in `/api/orders`).
- **lucide-react** — an icon library (cart, truck, wallet icons, etc.).
- **postgres.js** — the low-level driver that Drizzle uses to talk to
  PostgreSQL over the network.
- **Bun** — the JavaScript runtime / package manager used to run scripts
  (`bunx`, `bun install`).

---

## 5. Authentication — how it works in detail

### 5.1 Signing up (register)

1. The user fills name, email, password on `/register`.
2. The browser calls `signUp.email({ name, email, password })` from
   `src/lib/authclient.ts`, which sends a request to the server endpoint
   `/api/auth/sign-up/email`.
3. Better Auth:
   - Checks the password is strong enough.
   - **Hashes** the password (one-way scrambling) and stores the hash.
   - Inserts a row in `auth_user` with the user's info.
   - Inserts a row in `auth_account` (the "credential" account) containing the
     hashed password.
4. Our code adds a bonus step via a **database hook** in
   `src/lib/auth/auth.ts`: it also inserts a row into the app's own `users`
   table (so business pages like the farmer dashboard recognize the member).
5. On success, a session is created automatically and the user is "logged in".

### 5.2 Signing in (login)

1. The user enters email + password on `/login`.
2. The browser calls `signIn.email({ email, password })` → the server endpoint
   `/api/auth/sign-in/email`.
3. Better Auth looks up the email, verifies the password against the stored
   hash (using a safe password-verification algorithm), and if it matches,
   creates a **session** row and sends a cookie to the browser.
4. Our `LoginForm` then reads the `?next=` query parameter (e.g.
   `?next=/checkout`) and sends the user back to where they were going.

### 5.3 Checking "who is logged in"

- **In the browser**: the `useSession()` hook (from the auth client) calls the
  server, reads the cookie, and returns `{ user, session }` or `null`.
- **On the server**: in any API route, `auth.api.getSession({ headers })`
  verifies the cookie against the `auth_session` table.

### 5.4 Protecting pages

There are two layers:

1. **UI redirect (UX)**: the `/checkout` page uses `useSession()`; while the
   session is loading it renders nothing, and if there is no session it sends
   the user to `/login?next=/checkout`. This is _convenience_, not security.
2. **Server-side check (security)**: the `/api/orders` endpoint calls
   `auth.api.getSession()` and returns **401 Unauthorized** if there is no
   valid session. This is the real protection — even a hacker scripting the
   API cannot place an order without logging in.

Why both? UI-only protection is easy to bypass (you could just call the API
directly). Server-only protection is secure but gives a bad experience. We use
both.

### 5.5 Signing out

`signOut()` tells the server to delete the session. The profile menu shows a
spinner while that happens, then the app redirects home.

### 5.6 Where login-related code lives

```
src/app/register/page.tsx            # the sign-up page (name, email, password)
src/app/login/page.tsx               # the login page
src/components/auth/LoginForm.tsx    # the login form + spinner + redirect
src/lib/auth/auth.ts                 # server auth config (= auth instance)
src/lib/authclient.ts                # browser auth client (signIn, signUp, ...)
src/app/api/auth/[...all]/route.ts   # auto-generated auth endpoints (Don't edit by hand)
src/lib/db/auth-schema.ts            # database tables used by Better Auth
src/components/shared/AuthControl.tsx# navbar: Sign in link / profile menu / Log out
```

---

## 6. The folder structure — a map of the codebase

```
agriculture-e-commerce/
├─ .env                      # secrets & settings (DATABASE_URL, auth keys) - NEVER COMMIT
├─ package.json              # the list of libraries + commands the project needs
├─ drizzle.config.ts         # settings for database migrations
├─ src/
│  ├─ app/                   # every page & API endpoint (Next.js App Router)
│  │  ├─ page.tsx            # homepage ("/")
│  │  ├─ marketplace/        # browse produce ("/marketplace")
│  │  ├─ login/  register/   # authentication pages
│  │  ├─ cart/  checkout/    # buying flow
│  │  ├─ dashboard/          # farmer "selling desk" (+ listings/new)
│  │  ├─ orders/[orderId]/   # order tracking
│  │  ├─ admin/  analytics/  # admin + market analytics
│  │  ├─ articles/           # knowledge hub articles
│  │  └─ api/                # server endpoints (auth, orders, ...)
│  ├─ components/
│  │  ├─ auth/               # login form
│  │  ├─ buyer/              # produce cards, checkout panel
│  │  ├─ shared/             # navbar, cart control, auth control, language ...
│  │  ├─ marketing/          # landing-page pieces
│  │  └─ ui/                 # reusable buttons, cards
│  ├─ lib/                   # "brains": database, auth, cart, i18n, pricing
│  │  ├─ auth/auth.ts        # server auth config
│  │  ├─ authclient.ts       # browser auth client
│  │  ├─ db/                 # schema + database connection
│  │  ├─ useCart.ts          # reactive cart (localStorage) hook
│  │  ├─ useListings.ts      # reactive listings hook
│  │  ├─ i18n.ts             # translations (6 languages)
│  │  ├─ pricing.ts          # logistics & fee calculations
│  │  └─ demo-data.ts        # demo listings used for the prototype
│  └─ types.ts               # shared TypeScript types
```

### 6.7 State management — how the app remembers things

The app uses **React hooks** for "front-end memory":

- `useState` — simple local values (e.g. is the dropdown open?).
- `useCart()` — a shared cart that all pages use. It reads/writes
  `localStorage` and notifies every component when the cart changes, so the
  navbar badge updates instantly.
- `useListings()` — the marketplace data (demo data + local listings).
- `useSession()` — your login state (who is logged in).

There is no heavy global state library; a set of well-designed `use` hooks does
the job at this size.

### 6.8 Internationalization (i18n)

The whole interface can switch languages (English, Hindi, Telugu, Tamil,
Kannada, Marathi). Every UI string is wrapped in `t("English text")`. The
`LanguageProvider` looks up each string in `src/lib/i18n.ts` and returns the
translated version. The chosen language is remembered in localStorage.

---

## 7. Running the project locally

### 7.1 Requirements

- **Bun** (the JavaScript runtime) installed.
- A PostgreSQL database (this project uses a free **Neon** database — a
  PostgreSQL server hosted in the cloud).

### 7.2 Setup

```bash
bun install          # download all libraries listed in package.json
```

Create a `.env` file (copy the values the team shares internally):

```
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
BETTER_AUTH_SECRET="<a long random string>"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

### 7.3 Make the database match the code (migrations)

The database schema is described in code. To "push" that structure into the
database:

```bash
bunx drizzle-kit push     # creates/updates tables to match schema.ts
```

> Tip: `push` is fine in development. In production teams usually "generate"
> (`bun run db:generate`) and "migrate" (`bun run db:migrate`) so there is a
> recorded history of changes.

### 7.4 Start developing

```bash
bun run dev              # starts the site at http://localhost:3000
bun run lint             # checks code style
bunx tsc --noEmit        # checks types (TypeScript)
bun run build            # production build
```

---

## 8. How to extend the project with new features

The architecture is deliberately simple, so new features are straightforward.
The usual recipe:

1. **Add database tables** in `src/lib/db/schema.ts` (e.g. a `reviews` table).
2. **Push** the schema to the database (`bunx drizzle-kit push`).
3. **Add an API endpoint** in `src/app/api/.../route.ts` that reads/writes the
   database with Drizzle and _protects it with the session check_ (the same
   401 pattern as `/api/orders`).
4. **Add a page or component** in `src/app/...` / `src/components/...`, using
   the existing UI kit (Button, Card), the language `t()` helper, and the auth
   client hooks.
5. **Add translations** for any new text in `src/lib/i18n.ts`.

### Concrete "next feature" ideas

- **Real orders** — replace the simulated order API with a real
  `orders` + `order_items` insert and a stock decrement.
- **Real payments** — plug in a payment gateway (Razorpay/Stripe) at checkout
  instead of the "Simulate payment" button.
- **Farmer profile setup** — a wizard to collect village, district, lat/lng so
  delivery distance can be real instead of demo.
- **Transporter matching** — auto-assign a transporter when an order is packed.
- **Ratings & reviews** — buyers rate farmers after a delivered order.
- **Admin moderation** — approve/reject listings (the `admin` page already
  exists as a shell).
- **Email notifications** — send transactional emails on order events.

---

## 9. Ideas for integrating AI

There is already an "AI assistant" chat bubble in the navbar (currently
mock). Because the app's data is structured (listings, orders, prices), it is
well prepared for meaningful AI features:

- **Price prediction / advisory** — "suggested price" today comes from simple
  demo logic. An ML model trained on historical `regional_prices`, season, and
  demand could recommend optimal listing prices per region.
- **Market chat assistant (retrieval-augmented generation, RAG)** — instead of
  the mock assistant, connect an LLM (e.g. OpenAI/Gemini) that answers
  "what's the tomato price near Hyderabad?" by querying the actual database
  and summarizing the results.
- **Demand forecasting** — predict which produce will sell out, so farmers know
  what to plant/list.
- **Quality grading from photos** — farmers upload a photo of produce; a vision
  model estimates grade/quality before listing.
- **Logistics routing** — AI for optimal multi-farmer pickup routes, using the
  distances already computed by `pricing.ts`.
- **Multilingual support** — AI translation for buyer–farmer chats on orders.

The classic integration pattern is: **AI service (external) ← → your server
(Next.js API route) ← → your database**. The AI never talks to the browser
directly; your server controls what the AI is allowed to see and do.

---

## 10. A few terms you may hear in meetings

| Term                     | Plain meaning                                                                   |
| ------------------------ | ------------------------------------------------------------------------------- |
| **Client**               | The browser running on the user's device                                        |
| **Server**               | The computer (in the cloud) running the app's logic                             |
| **Endpoint / API route** | A URL on the server that apps call with data (e.g. `/api/orders`)               |
| **Database**             | The permanent storage of the app                                                |
| **Table / Row / Column** | How the database is organized (like a spreadsheet)                              |
| **Session**              | A temporary "you are logged in" ticket                                          |
| **Cookie**               | A small file the browser keeps that identifies the session                      |
| **Hash / hashing**       | Scrambling a value one-way (can't be unscrambled) — used for passwords          |
| **localStorage**         | Small storage inside the browser (demo data, cart, language)                    |
| **Hook**                 | A React function that gives components memory/behaviour (`useState`, `useCart`) |
| **Component**            | A reusable piece of the screen (`<Navbar />`, `<Button />`)                     |
| **Schema**               | The definition of the database structure                                        |
| **Migration**            | Recording a change to the database structure                                    |
| **i18n**                 | Internationalization = supporting multiple languages                            |
| **Auth**                 | Authentication = login / "who are you?"                                         |

---

## 11. One-page summary (for a presentation)

1. **What**: AgriLink — a demo farm-to-market platform (list produce, buy fresh,
   track delivery).
2. **Why**: better prices for farmers, fresh stock + honest costs for buyers.
3. **How it's built**:
   - Next.js + React + TypeScript (modern web app framework)
   - Tailwind CSS (styling)
   - Better Auth (real login/signup with hashed passwords + sessions)
   - PostgreSQL on Neon + Drizzle ORM (the database + translator)
   - Cart, listings, payments currently simulated (demo)
4. **Flow**: Home → Marketplace → Cart → Login/Signup → Checkout → Track.
5. **Security**: server-side session check returns 401 if you're not logged in;
   password hashing; the UI redirect is UX only, the API check is the real one.
6. **Next**: real orders/payments, farmer profiles, transporter matching,
   ratings, and AI price advisory / assistant.

---

_Questions or corrections? Add them to this file and keep the team's
"one source of truth" up to date._
