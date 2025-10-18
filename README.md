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

Set an API base URL via Vite env:

1) Create a `.env` file at the project root (Nordic-ICT-web):

```
VITE_API_URL=https://your-api.example.com/api
```

2) The default fallback is `http://localhost:5000/api` when `VITE_API_URL` is not set. The Axios client is defined in `src/infrastructure/http/apiClient.ts`.

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
