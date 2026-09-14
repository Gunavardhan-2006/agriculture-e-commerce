import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";

export const metadata: Metadata = {
  title: "AgriLink | Documentation",
  description:
    "Architecture, authentication, database, and extension guide for the AgriLink farm-to-market platform.",
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-16 mb-4 border-b border-slate-200 pb-3 font-display text-2xl font-bold text-slate-900 dark:border-slate-700 dark:text-stone-100">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-10 mb-3 font-display text-lg font-bold text-slate-900 dark:text-stone-100">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 leading-relaxed text-slate-700 dark:text-stone-300">
      {children}
    </p>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-geist-mono text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
      {children}
    </code>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mb-6 overflow-x-auto rounded-lg bg-slate-900 p-5 text-sm leading-relaxed text-slate-100 dark:bg-slate-950">
      <code className="font-geist-mono">{children}</code>
    </pre>
  );
}

function Note({
  title = "Note",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 px-5 py-4 dark:border-emerald-600 dark:bg-emerald-950/40">
      <p className="mb-1 font-display text-sm font-bold text-emerald-800 dark:text-emerald-300">
        {title}
      </p>
      <p className="text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
        {children}
      </p>
    </div>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-slate-200 bg-slate-50 text-left dark:border-slate-700 dark:bg-slate-800/60">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 font-display font-bold text-slate-900 dark:text-stone-100"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 dark:border-slate-800"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2 text-slate-700 dark:text-stone-300"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FlowDiagram() {
  return (
    <div className="my-8 rounded-xl border border-slate-200 bg-white p-6 font-geist-mono text-xs leading-loose text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:text-sm">
      <pre className="overflow-x-auto whitespace-pre">
{`                 ┌──────────────────────────────────────────────┐
                 │              THE BROWSER (Client)            │
                 │  Pages: Home, Marketplace, Cart, Login ...   │
                 └────────────────────┬─────────────────────────┘
                                      │ 1. Browser asks for a page
                                      │ 2. Sends form data / API calls
                                      │ 3. Receives HTML, JSON, updates UI
                 ┌────────────────────┴─────────────────────────┐
                 │           THE APPLICATION SERVER (Next.js)    │
                 │  Business logic, session checks, orders ...  │
                 └────────────────────┬─────────────────────────┘
                                      │ 4. Server reads / writes data
                 ┌────────────────────┴─────────────────────────┐
                 │            THE DATABASE (PostgreSQL)          │
                 │  Permanent storage: users, orders, sessions  │
                 └──────────────────────────────────────────────┘`}
      </pre>
    </div>
  );
}

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        {/* ─── Header ─────────────────────────────────────── */}
        <p className="mb-2 font-geist-mono text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          AgriLink
        </p>
        <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-stone-100">
          Documentation
        </h1>
        <p className="mb-12 text-lg text-slate-500 dark:text-stone-400">
          Everything you need to understand the architecture, run the project,
          and extend it with new features.
        </p>

        {/* ─── 1. What is this project? ───────────────────── */}
        <H2>What is this project?</H2>
        <P>
          <strong>AgriLink</strong> is a web application that lets farmers list
          fresh produce &mdash; vegetables, fruits, grains, spices &mdash; and
          lets buyers browse that produce, add it to a cart, and place orders
          for delivery.
        </P>
        <P>
          Think of it as an online marketplace designed for agriculture, like a
          farmer&apos;s market but on the internet. It is currently a{" "}
          <strong>demo / prototype</strong>: the core plumbing works (accounts,
          login, listings, cart, checkout), but payments and some data are
          simulated so the team can experiment safely.
        </P>

        {/* ─── 2. Why it exists ────────────────────────────── */}
        <H2>Why does this product exist?</H2>
        <H3>The problem it solves</H3>
        <P>
          In traditional agriculture trade, a farmer&apos;s produce passes
          through several middlemen before reaching a buyer. Each middleman
          takes a cut, so the farmer gets less and the buyer pays more.
          Information (real prices, fresh stock) is also hard to come by.
        </P>
        <H3>Where it can be used</H3>
        <ul className="mb-6 ml-5 list-disc space-y-1.5 text-slate-700 dark:text-stone-300">
          <li>
            <strong>Farm-to-business</strong> &mdash; restaurants, kirana stores,
            hotels ordering fresh vegetables in bulk.
          </li>
          <li>
            <strong>Government / FPOs</strong> &mdash; helping farmer collectives
            publish stock and get better prices.
          </li>
          <li>
            <strong>Local fairs / mandi digitalization</strong> &mdash; a digital
            version of the regional produce market.
          </li>
          <li>
            <strong>Logistics companies</strong> &mdash; matching farmers&apos;
            deliveries to transporters.
          </li>
        </ul>
        <H3>Why it&apos;s valuable</H3>
        <ul className="mb-6 ml-5 list-disc space-y-1.5 text-slate-700 dark:text-stone-300">
          <li>
            <strong>Price transparency</strong> &mdash; buyers see regional price
            baselines before paying.
          </li>
          <li>
            <strong>Less wastage</strong> &mdash; produce is listed while fresh,
            so it is sold faster.
          </li>
          <li>
            <strong>Access</strong> &mdash; small farmers get a direct digital
            shop-front.
          </li>
          <li>
            <strong>India-ready</strong> &mdash; the interface is translated into
            Hindi, Telugu, Tamil, Kannada, and Marathi.
          </li>
        </ul>

        {/* ─── 3. Architecture ─────────────────────────────── */}
        <H2>Architecture and flow</H2>
        <P>
          Before learning any technology names, understand the shape of the
          system:
        </P>
        <FlowDiagram />
        <H3>What happens when a buyer uses the app</H3>
        <ol className="mb-6 ml-5 list-decimal space-y-2 text-slate-700 dark:text-stone-300">
          <li>
            <strong>Visit the homepage</strong> &mdash; the browser asks the
            server for <InlineCode>/</InlineCode>. The server returns the HTML
            for the landing page.
          </li>
          <li>
            <strong>Browse the marketplace</strong> &mdash; the buyer opens{" "}
            <InlineCode>/marketplace</InlineCode>. They see fresh produce cards.
            Most listing data currently comes from bundled demo data + a local
            browser store.
          </li>
          <li>
            <strong>Add to cart</strong> &mdash; clicking &quot;Add to cart&quot;
            saves the item into the browser&apos;s{" "}
            <strong>localStorage</strong>. The cart icon badge updates instantly
            on every page because a shared cart store notifies all components.
          </li>
          <li>
            <strong>Sign up / Sign in</strong> &mdash; the buyer creates an
            account. This is <strong>real</strong> &mdash; credentials are stored
            in the PostgreSQL database via Better Auth. Passwords are hashed
            (scrambled one-way), never stored in plain text.
          </li>
          <li>
            <strong>Checkout</strong> &mdash; the buyer fills delivery details
            and places the order. The server first checks the session (is this
            person really logged in?) and returns <strong>401 Unauthorized</strong> if not.
          </li>
          <li>
            <strong>Track order</strong> &mdash; the buyer can see the order
            status: placed &rarr; confirmed &rarr; harvest &amp; pack &rarr;
            handed to transporter &rarr; in transit &rarr; delivered.
          </li>
        </ol>

        <Note title="Honest note for your team">
          This prototype mixes two kinds of storage. User accounts, logins, and
          sessions are <strong>real</strong> (stored in PostgreSQL via Better
          Auth). Marketplace listings, cart contents, and payments are{" "}
          <strong>demo</strong> (localStorage + bundled data). The goal is to
          replace each demo box with a real database-backed feature over time.
        </Note>

        {/* ─── 4. Tech stack ───────────────────────────────── */}
        <H2>Tech stack &mdash; every technology explained</H2>

        <H3>JavaScript (JS)</H3>
        <P>
          The programming language that web browsers understand. It is what
          makes a page interactive (buttons, dropdowns, fetching data).
        </P>

        <H3>TypeScript</H3>
        <P>
          JavaScript <strong>plus types</strong>. A type is a rule like
          &quot;this must be a number&quot; or &quot;this must be an email
          address.&quot; The computer checks these rules before the app runs,
          catching whole classes of mistakes.
        </P>

        <H3>React</H3>
        <P>
          A <strong>UI library</strong> for building user interfaces. You
          describe what the screen looks like with small building blocks called{" "}
          <strong>components</strong> (e.g. <InlineCode>{`<Card>`}</InlineCode>,{" "}
          <InlineCode>{`<Navbar>`}</InlineCode>,{" "}
          <InlineCode>{`<LoginForm>`}</InlineCode>). Two key ideas:
        </P>
        <ul className="mb-6 ml-5 list-disc space-y-1.5 text-slate-700 dark:text-stone-300">
          <li>
            <strong>State</strong> &mdash; data a component remembers. When state
            changes, React re-renders (redraws) that part of the screen.
          </li>
          <li>
            <strong>Props</strong> &mdash; data passed to a component (like
            arguments to a function).
          </li>
        </ul>

        <H3>Next.js (App Router)</H3>
        <P>
          A <strong>framework built on top of React</strong>. It provides
          file-based routing, server/client component splitting, and API routes.
        </P>
        <ul className="mb-6 ml-5 list-disc space-y-1.5 text-slate-700 dark:text-stone-300">
          <li>
            <strong>File-based routing</strong> &mdash; every file inside{" "}
            <InlineCode>src/app/**/page.tsx</InlineCode> becomes a real URL.
          </li>
          <li>
            <strong>Client vs Server components</strong> &mdash; files starting
            with <InlineCode>&quot;use client&quot;</InlineCode> run in the
            browser. Files without it run on the server.
          </li>
          <li>
            <strong>API routes</strong> &mdash; files inside{" "}
            <InlineCode>src/app/api/**/route.ts</InlineCode> are server
            endpoints the browser calls with JSON.
          </li>
        </ul>

        <H3>Tailwind CSS</H3>
        <P>
          How we style the app. Instead of long CSS files, you add tiny utility
          classes directly on elements:{" "}
          <InlineCode>rounded-lg bg-emerald-700 text-white</InlineCode>.
        </P>

        <H3>PostgreSQL (on Neon)</H3>
        <P>
          The permanent memory of the app. Data is stored in{" "}
          <strong>tables</strong> (like Excel sheets with rows and columns):
          users, sessions, listings, orders, payments, deliveries, reviews, and
          more.
        </P>

        <H3>Drizzle ORM</H3>
        <P>
          An <strong>ORM</strong> (Object Relational Mapper) translates between
          the database and TypeScript. Instead of raw SQL everywhere, you
          describe the database schema in code (
          <InlineCode>src/lib/db/schema.ts</InlineCode>) and Drizzle converts
          it.
        </P>

        <H3>Better Auth</H3>
        <P>
          A ready-made authentication library that handles sign-up, sign-in,
          sessions, and password hashing. Detailed breakdown in §5.
        </P>

        <H3>Other utilities</H3>
        <Table
          headers={["Library", "Purpose"]}
          rows={[
            ["zod", "Request validation (rejects bad data)"],
            ["lucide-react", "Icon set (cart, truck, wallet icons, etc.)"],
            ["postgres.js", "Low-level driver that talks to PostgreSQL"],
            ["Bun", "JavaScript runtime and package manager"],
          ]}
        />

        {/* ─── 5. Authentication ───────────────────────────── */}
        <H2>Authentication &mdash; how it works</H2>

        <H3>Signing up (register)</H3>
        <ol className="mb-6 ml-5 list-decimal space-y-2 text-slate-700 dark:text-stone-300">
          <li>
            User fills name, email, password on{" "}
            <InlineCode>/register</InlineCode>.
          </li>
          <li>
            The browser calls{" "}
            <InlineCode>signUp.email({"{ name, email, password }"})</InlineCode>{" "}
            which hits the server endpoint{" "}
            <InlineCode>/api/auth/sign-up/email</InlineCode>.
          </li>
          <li>
            Better Auth hashes the password and inserts rows into{" "}
            <InlineCode>auth_user</InlineCode> and{" "}
            <InlineCode>auth_account</InlineCode>.
          </li>
          <li>
            A database hook also inserts a row into the app&apos;s own{" "}
            <InlineCode>users</InlineCode> table so business pages recognize
            the member.
          </li>
          <li>A session is created automatically; the user is logged in.</li>
        </ol>

        <H3>Signing in (login)</H3>
        <ol className="mb-6 ml-5 list-decimal space-y-2 text-slate-700 dark:text-stone-300">
          <li>
            User enters email + password on <InlineCode>/login</InlineCode>.
          </li>
          <li>
            The browser calls{" "}
            <InlineCode>signIn.email({"{ email, password }"})</InlineCode>{" "}
            &rarr; server endpoint{" "}
            <InlineCode>/api/auth/sign-in/email</InlineCode>.
          </li>
          <li>
            Better Auth verifies the password against the stored hash and, on
            match, creates a session row and sends a cookie to the browser.
          </li>
          <li>
            Our <InlineCode>LoginForm</InlineCode> reads the{" "}
            <InlineCode>?next=</InlineCode> query parameter and redirects the
            user to where they were going.
          </li>
        </ol>

        <H3>Checking &quot;who is logged in&quot;</H3>
        <ul className="mb-6 ml-5 list-disc space-y-1.5 text-slate-700 dark:text-stone-300">
          <li>
            <strong>In the browser</strong>: the{" "}
            <InlineCode>useSession()</InlineCode> hook reads the cookie and
            returns <InlineCode>{"{ user, session }"}</InlineCode> or{" "}
            <InlineCode>null</InlineCode>.
          </li>
          <li>
            <strong>On the server</strong>: in any API route,{" "}
            <InlineCode>auth.api.getSession({"{ headers }"})</InlineCode>{" "}
            verifies the cookie against the{" "}
            <InlineCode>auth_session</InlineCode> table.
          </li>
        </ul>

        <H3>Protecting pages &mdash; two layers</H3>
        <P>
          There are two layers of protection, and both are necessary:
        </P>
        <Table
          headers={["Layer", "Where", "What it does"]}
          rows={[
            [
              "UI redirect",
              "Client component (e.g. /checkout)",
              "Convenience only — redirects to /login?next=/checkout. Easy to bypass.",
            ],
            [
              "Server check",
              "API route (e.g. /api/orders)",
              "Real security — returns 401 Unauthorized. Cannot be bypassed.",
            ],
          ]}
        />
        <P>
          UI-only protection is easy to bypass (you could call the API directly).
          Server-only protection is secure but gives a bad experience. We use
          both.
        </P>

        <H3>Signing out</H3>
        <P>
          <InlineCode>signOut()</InlineCode> tells the server to delete the
          session. The profile menu shows a spinner while that happens, then the
          app redirects home.
        </P>

        <H3>Where login-related code lives</H3>
        <Table
          headers={["File", "Purpose"]}
          rows={[
            [
              "src/app/register/page.tsx",
              "Sign-up page (name, email, password)",
            ],
            ["src/app/login/page.tsx", "Login page"],
            [
              "src/components/auth/LoginForm.tsx",
              "Login form + spinner + redirect",
            ],
            [
              "src/lib/auth/auth.ts",
              "Server auth config (the auth instance)",
            ],
            [
              "src/lib/authclient.ts",
              "Browser auth client (signIn, signUp, ...)",
            ],
            [
              "src/app/api/auth/[...all]/route.ts",
              "Auto-generated auth endpoints (do not edit)",
            ],
            [
              "src/lib/db/auth-schema.ts",
              "Database tables used by Better Auth",
            ],
            [
              "src/components/shared/AuthControl.tsx",
              "Navbar: Sign in link / profile menu / Log out",
            ],
          ]}
        />

        {/* ─── 6. Folder structure ─────────────────────────── */}
        <H2>The folder structure</H2>
        <CodeBlock>{`agriculture-e-commerce/
├─ .env                      # secrets & settings — NEVER COMMIT
├─ package.json              # libraries + commands the project needs
├─ drizzle.config.ts         # settings for database migrations
├─ src/
│  ├─ app/                   # every page & API endpoint
│  │  ├─ page.tsx            # homepage ("/")
│  │  ├─ marketplace/        # browse produce ("/marketplace")
│  │  ├─ login/  register/   # authentication pages
│  │  ├─ cart/  checkout/    # buying flow
│  │  ├─ dashboard/          # farmer "selling desk"
│  │  ├─ orders/[orderId]/   # order tracking
│  │  ├─ admin/  analytics/  # admin + market analytics
│  │  ├─ articles/           # knowledge hub articles
│  │  └─ api/                # server endpoints (auth, orders, ...)
│  ├─ components/
│  │  ├─ auth/               # login form
│  │  ├─ buyer/              # produce cards, checkout panel
│  │  ├─ shared/             # navbar, cart control, auth control ...
│  │  ├─ marketing/          # landing-page pieces
│  │  └─ ui/                 # reusable buttons, cards
│  ├─ lib/                   # database, auth, cart, i18n, pricing
│  │  ├─ auth/auth.ts        # server auth config
│  │  ├─ authclient.ts       # browser auth client
│  │  ├─ db/                 # schema + database connection
│  │  ├─ useCart.ts          # reactive cart (localStorage) hook
│  │  ├─ useListings.ts      # reactive listings hook
│  │  ├─ i18n.ts             # translations (6 languages)
│  │  ├─ pricing.ts          # logistics & fee calculations
│  │  └─ demo-data.ts        # demo listings for the prototype
│  └─ types.ts               # shared TypeScript types`}</CodeBlock>

        <H3>State management</H3>
        <P>
          The app uses <strong>React hooks</strong> for front-end memory:
        </P>
        <ul className="mb-6 ml-5 list-disc space-y-1.5 text-slate-700 dark:text-stone-300">
          <li>
            <strong>useState</strong> &mdash; simple local values (e.g. is the
            dropdown open?).
          </li>
          <li>
            <strong>useCart()</strong> &mdash; a shared cart that all pages use.
            It reads/writes localStorage and notifies every component when the
            cart changes.
          </li>
          <li>
            <strong>useListings()</strong> &mdash; the marketplace data (demo
            data + local listings).
          </li>
          <li>
            <strong>useSession()</strong> &mdash; your login state.
          </li>
        </ul>

        <H3>Internationalization (i18n)</H3>
        <P>
          The whole interface supports six languages: English, Hindi, Telugu,
          Tamil, Kannada, and Marathi. Every UI string is wrapped in{" "}
          <InlineCode>t(&quot;English text&quot;)</InlineCode>. The chosen
          language is remembered in localStorage.
        </P>

        {/* ─── 7. Running locally ──────────────────────────── */}
        <H2>Running the project locally</H2>

        <H3>Requirements</H3>
        <ul className="mb-6 ml-5 list-disc space-y-1.5 text-slate-700 dark:text-stone-300">
          <li>
            <strong>Bun</strong> (the JavaScript runtime) installed.
          </li>
          <li>
            A PostgreSQL database (this project uses a free Neon database).
          </li>
        </ul>

        <H3>Setup</H3>
        <CodeBlock>{`bun install          # download all libraries listed in package.json`}</CodeBlock>
        <P>
          Create a <InlineCode>.env</InlineCode> file with the team&apos;s
          shared values:
        </P>
        <CodeBlock>{`DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
BETTER_AUTH_SECRET="<a long random string>"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"`}</CodeBlock>

        <H3>Make the database match the code</H3>
        <CodeBlock>{`bunx drizzle-kit push     # creates / updates tables to match schema.ts`}</CodeBlock>
        <Note>
          <InlineCode>push</InlineCode> is fine in development. In production
          teams usually{" "}
          <InlineCode>bun run db:generate</InlineCode> and{" "}
          <InlineCode>bun run db:migrate</InlineCode> so there is a recorded
          history of changes.
        </Note>

        <H3>Start developing</H3>
        <CodeBlock>{`bun run dev              # starts the site at http://localhost:3000
bun run lint             # checks code style
bunx tsc --noEmit        # checks types (TypeScript)
bun run build            # production build`}</CodeBlock>

        {/* ─── 8. Extending ────────────────────────────────── */}
        <H2>How to extend the project</H2>
        <P>
          The architecture is deliberately simple. New features follow this
          recipe:
        </P>
        <ol className="mb-6 ml-5 list-decimal space-y-2 text-slate-700 dark:text-stone-300">
          <li>
            <strong>Add database tables</strong> in{" "}
            <InlineCode>src/lib/db/schema.ts</InlineCode>.
          </li>
          <li>
            <strong>Push the schema</strong> to the database (
            <InlineCode>bunx drizzle-kit push</InlineCode>).
          </li>
          <li>
            <strong>Add an API endpoint</strong> in{" "}
            <InlineCode>src/app/api/.../route.ts</InlineCode> that reads /
            writes the database and protects itself with the session check (the
            401 pattern from <InlineCode>/api/orders</InlineCode>).
          </li>
          <li>
            <strong>Add a page or component</strong> in{" "}
            <InlineCode>src/app/...</InlineCode> /{" "}
            <InlineCode>src/components/...</InlineCode>, using the existing UI
            kit, the language <InlineCode>t()</InlineCode> helper, and the auth
            client hooks.
          </li>
          <li>
            <strong>Add translations</strong> for any new text in{" "}
            <InlineCode>src/lib/i18n.ts</InlineCode>.
          </li>
        </ol>

        <H3>Concrete next-feature ideas</H3>
        <ul className="mb-6 ml-5 list-disc space-y-1.5 text-slate-700 dark:text-stone-300">
          <li>
            <strong>Real orders</strong> &mdash; replace the simulated order API
            with real inserts and a stock decrement.
          </li>
          <li>
            <strong>Real payments</strong> &mdash; plug in Razorpay / Stripe at
            checkout.
          </li>
          <li>
            <strong>Farmer profile setup</strong> &mdash; a wizard to collect
            village, district, lat/lng for real delivery distance.
          </li>
          <li>
            <strong>Transporter matching</strong> &mdash; auto-assign a
            transporter when an order is packed.
          </li>
          <li>
            <strong>Ratings &amp; reviews</strong> &mdash; buyers rate farmers
            after a delivered order.
          </li>
          <li>
            <strong>Admin moderation</strong> &mdash; approve / reject listings
            (the admin page already exists as a shell).
          </li>
          <li>
            <strong>Email notifications</strong> &mdash; transactional emails on
            order events.
          </li>
        </ul>

        {/* ─── 9. AI integration ───────────────────────────── */}
        <H2>Ideas for integrating AI</H2>
        <P>
          The app already includes an &quot;AI assistant&quot; chat bubble in the
          navbar (currently mocked). Because the data is structured (listings,
          orders, prices), it is well prepared for meaningful AI features:
        </P>
        <ul className="mb-6 ml-5 list-disc space-y-1.5 text-slate-700 dark:text-stone-300">
          <li>
            <strong>Price prediction</strong> &mdash; an ML model trained on
            historical regional prices, season, and demand could recommend
            optimal listing prices.
          </li>
          <li>
            <strong>Market chat assistant (RAG)</strong> &mdash; connect an LLM
            that queries the actual database and summarizes results.
          </li>
          <li>
            <strong>Demand forecasting</strong> &mdash; predict which produce
            will sell out, so farmers know what to list.
          </li>
          <li>
            <strong>Quality grading from photos</strong> &mdash; a vision model
            estimates produce grade before listing.
          </li>
          <li>
            <strong>Logistics routing</strong> &mdash; AI for optimal
            multi-farmer pickup routes.
          </li>
          <li>
            <strong>Multilingual support</strong> &mdash; AI translation for
            buyer-farmer chats on orders.
          </li>
        </ul>
        <P>
          The classic integration pattern:{" "}
          <strong>AI service (external) &larr; &rarr; your server (Next.js API
          route) &larr; &rarr; your database</strong>. The AI never talks to the
          browser directly; your server controls what the AI can see and do.
        </P>

        {/* ─── 10. Glossary ────────────────────────────────── */}
        <H2>A few terms you may hear</H2>
        <Table
          headers={["Term", "Plain meaning"]}
          rows={[
            ["Client", "The browser running on the user's device"],
            [
              "Server",
              "The computer (in the cloud) running the app's logic",
            ],
            [
              "Endpoint / API route",
              "A URL on the server that apps call with data (e.g. /api/orders)",
            ],
            ["Database", "The permanent storage of the app"],
            [
              "Table / Row / Column",
              "How the database is organized (like a spreadsheet)",
            ],
            [
              "Session",
              'A temporary "you are logged in" ticket',
            ],
            [
              "Cookie",
              "A small file the browser keeps that identifies the session",
            ],
            [
              "Hash / hashing",
              "Scrambling a value one-way — used for passwords",
            ],
            [
              "localStorage",
              "Small storage inside the browser (demo data, cart, language)",
            ],
            [
              "Hook",
              "A React function that gives components memory/behaviour",
            ],
            ["Component", "A reusable piece of the screen"],
            [
              "Schema",
              "The definition of the database structure",
            ],
            ["Migration", "Recording a change to the database structure"],
            [
              "i18n",
              "Internationalization = supporting multiple languages",
            ],
          ]}
        />

        {/* ─── 11. Summary ─────────────────────────────────── */}
        <H2>One-page summary</H2>
        <ol className="mb-6 ml-5 list-decimal space-y-2 text-slate-700 dark:text-stone-300">
          <li>
            <strong>What</strong>: AgriLink — a demo farm-to-market platform
            (list produce, buy fresh, track delivery).
          </li>
          <li>
            <strong>Why</strong>: better prices for farmers, fresh stock +
            honest costs for buyers.
          </li>
          <li>
            <strong>How</strong>: Next.js + React + TypeScript + Tailwind CSS +
            Better Auth + PostgreSQL on Neon + Drizzle ORM.
          </li>
          <li>
            <strong>Flow</strong>: Home &rarr; Marketplace &rarr; Cart &rarr;
            Login/Signup &rarr; Checkout &rarr; Track.
          </li>
          <li>
            <strong>Security</strong>: server-side session check returns 401 if
            you are not logged in; password hashing; UI redirect is UX only, the
            API check is the real one.
          </li>
          <li>
            <strong>Next</strong>: real orders, payments, transporter matching,
            ratings, AI price advisory.
          </li>
        </ol>

        <div className="mt-20 border-t border-slate-200 pt-8 text-center dark:border-slate-700">
          <p className="font-geist-mono text-xs text-slate-400 dark:text-slate-600">
            Questions or corrections? Edit{" "}
            <InlineCode>docs.md</InlineCode> or this page to keep the
            team&apos;s source of truth up to date.
          </p>
        </div>
      </main>
    </>
  );
}
