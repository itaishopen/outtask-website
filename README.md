# Outtask Website — Angular Monorepo

A modern, production-quality replacement for the Outtask WordPress website. Built as an Nx monorepo with Angular (SSR), NestJS, PostgreSQL, and an integrated CMS admin panel with Microsoft Entra ID authentication.

---

## Architecture Overview

```
outtask-website/
├── apps/
│   ├── web/          # Public Angular SSR website (port 4200)
│   ├── admin/        # Angular admin CMS (port 4201)
│   └── api/          # NestJS REST API (port 3000)
├── libs/
│   ├── shared-types/ # TypeScript DTOs and interfaces
│   ├── ui/           # Shared Angular component library
│   ├── auth/         # Angular MSAL guards/interceptors
│   ├── content/      # Section renderer engine
│   ├── jobs/         # Job provider abstraction
│   └── data-access/  # Angular HTTP services
├── prisma/           # Database schema, migrations, seed
├── e2e/              # Playwright E2E tests
└── docker-compose.yml
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend (public) | Angular 18, SSR, Standalone components, SCSS |
| Frontend (admin) | Angular 18 SPA, MSAL Angular |
| Backend | NestJS 10, Passport.js, JWT |
| Database | PostgreSQL 16, Prisma ORM |
| Auth | Microsoft Entra ID (Azure AD) OIDC |
| Package manager | pnpm + Nx monorepo |
| Testing | Jest, Playwright |
| CI/CD | GitHub Actions |

---

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm (`npm install -g pnpm`)
- Docker & Docker Compose (for local PostgreSQL)

### 1. Clone and install

```bash
git clone <repo-url> outtask-website
cd outtask-website
pnpm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit .env with your values (see Environment Variables section below)
```

### 3. Start the database

```bash
docker compose up db -d
```

### 4. Set up the database

```bash
# Run migrations
pnpm db:migrate:dev

# Seed with initial data (roles, admin user, sample content)
pnpm db:seed
```

### 5. Start development servers

```bash
# Start API and web together
pnpm dev

# Or start individually:
pnpm dev:api    # NestJS API on http://localhost:3000
pnpm dev:web    # Angular website on http://localhost:4200
pnpm dev:admin  # Angular admin on http://localhost:4201
```

### 6. Open the apps

- **Public website**: http://localhost:4200/en/
- **Admin panel**: http://localhost:4201/
- **API docs (Swagger)**: http://localhost:3000/api/docs
- **pgAdmin** (optional): `docker compose --profile tools up -d`, then http://localhost:5050

---

## Environment Variables

See `.env.example` for all variables. Key variables:

```bash
DATABASE_URL=postgresql://outtask:password@localhost:5432/outtask

# Microsoft Entra ID — register at https://portal.azure.com
MICROSOFT_CLIENT_ID=your-azure-app-client-id
MICROSOFT_CLIENT_SECRET=your-azure-app-client-secret
MICROSOFT_TENANT_ID=your-azure-tenant-id

# JWT
JWT_SECRET=your-64-char-random-string
JWT_REFRESH_SECRET=your-other-64-char-random-string

# Allowed email domains for admin access
ALLOWED_EMAIL_DOMAINS=outtask.nl
```

### Setting up Microsoft Entra ID

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. New registration:
   - Name: Outtask Website
   - Redirect URI (Web): `http://localhost:3000/api/auth/microsoft/callback` (dev), `https://api.outtask.nl/api/auth/microsoft/callback` (prod)
3. Add a client secret
4. In API permissions: add `User.Read` (Microsoft Graph)
5. Copy Client ID, Client Secret, Tenant ID to `.env`
6. In `apps/admin/src/environments/environment.ts`: update `clientId`, `authority`, `redirectUri`

---

## Admin Panel Access

1. First-time setup: run `pnpm db:seed` to create the VIEWER/EDITOR/ADMIN roles
2. Navigate to http://localhost:4201/login
3. Click "Sign in with Microsoft"
4. First user from an allowed domain gets VIEWER role automatically
5. Promote to ADMIN via database: `UPDATE "User" SET "roleId" = (SELECT id FROM "Role" WHERE name = 'ADMIN') WHERE email = 'your@email.nl';`
6. As ADMIN, you can change other users' roles from the admin panel

---

## Database Commands

```bash
# Create a new migration during development
pnpm db:migrate:dev -- --name descriptive-migration-name

# Apply migrations (production)
pnpm db:migrate

# Open Prisma Studio (visual DB browser)
pnpm db:studio

# Regenerate Prisma client after schema changes
pnpm db:generate

# Re-run seed data
pnpm db:seed
```

---

## Job Provider System

The vacancy sync system uses a provider abstraction. To add a new ATS:

1. Implement `JobProvider` interface in `libs/jobs/src/lib/providers/`
2. Register in `JobsService.PROVIDER_REGISTRY` in `apps/api/src/jobs/jobs.service.ts`
3. Add the type string to the admin "Add provider" dropdown

Built-in providers:
- `manual` — Jobs entered directly in admin panel (no sync)
- `recruitee` — Stub implementation (contact Outtask dev team to activate)
- `greenhouse` — Stub implementation

Sync runs automatically every 6 hours via `@Cron('0 */6 * * *')`.
Manual sync: Admin panel → Job Providers → "Sync now".

---

## Page Builder System

Pages consist of ordered sections. Each section has a `type` and a `config` JSON object.

### Section Types

| Type | Component | Description |
|---|---|---|
| `HERO` | HeroSectionComponent | Full-width hero with headline and CTAs |
| `TEXT_IMAGE` | TextImageSectionComponent | Two-column text + image |
| `CARDS` | CardsSectionComponent | Grid of feature cards |
| `TESTIMONIALS` | TestimonialsComponent | Client quotes |
| `CTA` | CtaSectionComponent | Full-width call to action |
| `RICH_TEXT` | RichTextSectionComponent | Free-form HTML content |
| `VACANCY_LIST` | VacancyListSectionComponent | Dynamic vacancy cards |
| `BLOG_LIST` | BlogListSectionComponent | Dynamic blog post cards |
| `LOGO_CLOUD` | LogoCloudSectionComponent | Partner/client logos |
| `FAQ` | FaqSectionComponent | Accordion FAQ |

To add a new section type:
1. Add the type to `SectionType` enum in `prisma/schema.prisma` and `libs/shared-types/src/lib/enums.ts`
2. Create the config interface in `libs/shared-types/src/lib/page.types.ts`
3. Create the Angular component in `libs/ui/src/lib/`
4. Register it in `SECTION_COMPONENT_MAP` in `libs/content/src/lib/section-renderer.component.ts`
5. Run `pnpm db:migrate:dev`

---

## Testing

```bash
# All tests
pnpm test

# API unit tests only
pnpm --filter @outtask/api test

# API with coverage
pnpm --filter @outtask/api test:cov

# Angular web tests
pnpm --filter @outtask/web test

# E2E tests (requires running servers)
pnpm e2e

# E2E with UI mode
npx playwright test --ui
```

---

## Building for Production

```bash
# Build all apps
pnpm build

# Build individual apps
pnpm build:web    # Angular SSR website
pnpm build:admin  # Angular admin SPA
pnpm build:api    # NestJS API
```

### Production environment

Set these additional variables in production:

```bash
NODE_ENV=production
CORS_ORIGINS=https://outtask.nl,https://admin.outtask.nl
ADMIN_URL=https://admin.outtask.nl
MICROSOFT_REDIRECT_URI=https://api.outtask.nl/api/auth/microsoft/callback
STORAGE_PROVIDER=azure  # or s3
```

---

## Docker

```bash
# Start only the database (most common for development)
docker compose up db -d

# Start full stack (API + Web + Admin + DB)
docker compose --profile full up -d

# With pgAdmin tool
docker compose --profile tools --profile full up -d

# View logs
docker compose logs api -f

# Stop everything
docker compose down
```

---

## Deployment

### Recommended Setup

| Component | Recommended Service |
|---|---|
| PostgreSQL | Azure Database for PostgreSQL, Supabase, Neon |
| API | Azure App Service, Railway, Render |
| Web (SSR) | Azure App Service, Vercel (Node.js), Railway |
| Admin (SPA) | Azure Static Web Apps, Vercel, Netlify |
| Media storage | Azure Blob Storage, AWS S3 |

### Azure Static Web Apps (Admin)

```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy admin
swa deploy apps/admin/dist/admin/browser --deployment-token $AZURE_STATIC_WEB_APPS_API_TOKEN
```

### Vercel (Web SSR)

The `apps/web` app is an Angular SSR app. Deploy as a Node.js app:

```bash
# vercel.json in apps/web/
{
  "builds": [{ "src": "dist/web/server/server.mjs", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/dist/web/server/server.mjs" }]
}
```

---

## Project Structure — Detailed

```
apps/api/src/
├── auth/              # Microsoft OIDC, JWT strategy, auth service/controller
├── blog/              # Blog post CRUD, publish/unpublish
├── common/
│   ├── decorators/    # @CurrentUser, @Roles, @Public
│   ├── filters/       # Global HTTP exception filter
│   ├── guards/        # JwtAuthGuard, RolesGuard
│   └── interceptors/  # TransformInterceptor (wraps all responses)
├── config/            # Typed config modules (app, auth, database, storage)
├── jobs/              # Job provider CRUD, sync service, provider registry
├── media/             # File upload, media asset management
├── pages/             # Page + section CRUD, section reorder
├── prisma/            # PrismaService (global)
├── public/            # Public API endpoints (no auth)
├── vacancies/         # Vacancy CRUD with filters
└── audit/             # Audit log write + query

apps/web/src/app/
├── core/
│   ├── interceptors/  # API URL interceptor
│   ├── services/      # SeoService, PublicApiService
│   └── tokens/        # API_BASE_URL injection token
├── features/
│   ├── home/          # Homepage (section-renderer driven)
│   ├── services/      # Staffing, Nearshoring pages
│   ├── vacancies/     # Vacancy list + detail
│   ├── blog/          # Blog list + detail
│   ├── roles/         # Dynamic role landing pages
│   ├── working-at-outtask/
│   ├── expats/
│   ├── happy-people/
│   ├── hire-a-developer/
│   ├── contact/
│   └── not-found/
└── layout/
    ├── shell/         # App shell (header + router-outlet + footer)
    ├── header/        # Navigation with mobile menu
    └── footer/        # Footer with columns

libs/
├── shared-types/      # All TypeScript interfaces, DTOs, enums (no Angular/NestJS)
├── ui/                # Standalone Angular section components
├── content/           # SectionRendererComponent (maps type → component)
├── jobs/              # JobProvider interface + implementations
└── data-access/       # Angular HTTP services (PublicApiService, AdminApiService)
```

---

## Contributing

1. Branch from `develop`
2. Follow the TypeScript strict mode rules
3. Add tests for new backend services
4. Run `pnpm lint` and `pnpm test` before pushing
5. Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`

---

## License

Private — Outtask BV. All rights reserved.
