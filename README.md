# Nordic-ICT Web (React + TypeScript + Vite)

This app is organized using a lightweight Clean Architecture to keep UI, business logic, and infrastructure concerns separate. It also contains a website route at `/site` alongside the admin dashboard.

## Structure

src/
- application/
  - usecases/
    - GetProjects.ts
    - GetNews.ts
    - GetPartners.ts
- domain/
  - entities/
    - Project.ts
    - NewsPost.ts
    - Partner.ts
  - repositories/
    - ProjectRepository.ts
    - NewsRepository.ts
    - PartnerRepository.ts
- infrastructure/
  - http/
    - apiClient.ts
  - repositories/
    - AxiosProjectRepository.ts
    - AxiosNewsRepository.ts
    - AxiosPartnerRepository.ts
- contexts/
  - DataContext.tsx (uses application use-cases and infrastructure repos)
- website/
  - App.tsx
  - components/ (Hero, Services, About, News, Projects, Partners, Footer, etc.)
- App.tsx, Root.tsx, DashboardApp.tsx, components/... (admin dashboard)

Key idea:
- domain is pure types and interfaces
- application contains use cases that depend only on domain interfaces
- infrastructure implements those interfaces (Axios, etc.)
- presentation (React) consumes use cases via contexts/components

## API configuration

By default, the app uses same-origin `/api` as the base URL and the Vite dev server proxies it to your backend.

- Axios base URL: `/api` (see `src/infrastructure/http/apiClient.ts`)
- Vite proxy target: `http://localhost:8080` by default (see `vite.config.ts`)

You can override the proxy target by creating a `.env` file at the project root (Nordic-ICT-web):

```
VITE_PROXY_TARGET=http://localhost:8080
```

Alternatively, to bypass the proxy and hit a full origin, set:

```
VITE_API_URL=https://your-api.example.com/api
```

If `VITE_API_URL` is set, Axios will use it directly; otherwise it uses `/api` which the dev proxy will forward.

## Run locally

Install deps and start dev server:

```bash
npm install
npm run dev
```

Open:
- Dashboard: http://localhost:5173/
- Website: http://localhost:5173/site

Build for production:

```bash
npm run build
npm run preview
```

## Notes
- `DataContext` now exposes `loading` and `error` to help components render spinners or error messages.
- Repository implementations normalize dates where appropriate (e.g., `Project.startDate`).
- Keep UI components focused on presentation—business logic belongs in use cases.
# Nordic-ICT-frontend
