# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript check + Vite production build (tsc -b && vite build)
npm run lint       # Run ESLint on all TS/TSX files
npm run preview    # Preview production build locally
```

## Environment Variables

Requires a `.env` file with:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEMINI_API_KEY=
```

Accessed via `import.meta.env.VITE_*` throughout the app.

## Architecture

**NutriFlow** is a React 19 + TypeScript nutrition tracking SPA built with Vite. Tech stack: Tailwind CSS 4, Zustand for state, Supabase (PostgreSQL + Auth), Google Gemini AI, Recharts, Framer Motion, Lucide icons.

### Routing & Auth Flow

`App.tsx` controls top-level routing using a simple boolean auth check (no React Router). When unauthenticated, renders `AuthPage`; when authenticated, renders `AppContent` which wraps `AppLayout` + either `Dashboard` or `ProfileEditor`. Auth state is provided via `AuthContext` (`contexts/AuthContext.tsx`).

### State Management

Three Zustand stores in `src/store/`:
- **`useMealStore`** — meals CRUD, daily goals, selected date; syncs to Supabase `meals` and `profiles` tables
- **`useFavoritesStore`** — favorite meals persisted to localStorage
- **`useToastStore`** — ephemeral toast notifications (auto-dismiss)

User session and profile data live in React Context (`AuthContext`), not Zustand.

### Data Flow

1. On login, `AuthContext` fetches the user's `profiles` row and exposes it as `profile`
2. `useMealStore.fetchMeals()` (no params) resolves the current user from Supabase auth internally and loads **all** of that user's meals into the store — there is no server-side date filter
3. `MealsList` filters the store's `meals` array client-side via `useMemo` on `selectedDateStr` to show only the selected day; `HistoryChart`/`WeeklySummary` similarly filter client-side
4. Daily goal values come from the `profiles` table (`calories_goal`, `protein_goal`, etc.)
5. Meals are further filtered by category in `MealCategorySection`, rendered in fixed order: `breakfast → lunch → snack → dinner`

### AI Integration

`src/services/geminiService.ts` wraps the Gemini 2.5 Flash API. Two exported functions:
- `analyzeMealText(text)` — text description → structured nutrition JSON
- `analyzeMealImage(base64Image, mimeType)` — image → structured nutrition JSON

Both return `{ name, calories, protein, carbs, fat, portion }` with robust JSON extraction (strips markdown code fences if present).

### Supabase Schema

- **`meals`**: `id, user_id, name, calories, protein, carbs, fat, time (HH:mm), category, date_str (YYYY-MM-DD), image_url (base64), created_at`
- **`profiles`**: `id (=user_id), name, weight, height, birth_date, gender, activity_level, goal_type, target_weight, avatar_url, calories_goal, protein_goal, carbs_goal, fat_goal, updated_at`

### Key Types (`src/types.ts`)

```typescript
type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete'
type GoalType = 'lose' | 'maintain' | 'gain'
```

The `Meal` interface uses `dateStr` (not a Date object) for date storage.

### Styling Conventions

- Tailwind CSS 4 with `dark:` variants for dark mode
- Theme toggled via `useTheme()` hook (stored in localStorage, respects system preference on first load)
- Primary color: emerald-500 (`#10b981`) defined as `--color-primary` in `src/index.css`
- Design style: glassmorphism (backdrop blur + transparency), rounded-full/3xl corners, mobile-first with `max-w-md` container

### Food Library

`src/data/foodLibrary.ts` contains 26 pre-loaded foods with Portuguese names and nutritional data per portion. Used in `AddMealModal` for quick selection.

### UI Language

All user-facing strings are in **Brazilian Portuguese**. When adding new UI text, use pt-BR (e.g., "Refeição", "Calorias", "Salvar").

### No Test Framework

There is no test setup in this project. `npm run lint` is the only code-quality check available beyond `tsc`.
