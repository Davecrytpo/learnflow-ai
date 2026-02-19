
# Fix: Onboarding Loop, Auth Architecture & Full Platform Stability

## Root Cause Diagnosis

The blinking/looping issue has **three compounding problems**:

### Problem 1 — Duplicate roles in the database
The logged-in user has **two rows** in `user_roles`: both `instructor` AND `student`. The `useUserRole` hook queries with `.limit(1)` but **no ORDER BY**, so the database returns a random role on each call. One call returns `instructor` (redirects to `/instructor`), the next call returns `student` (redirects to `/dashboard/student`), causing the infinite flicker.

### Problem 2 — No shared auth state (root architecture issue)
Every component that uses `useAuth()` or `useUserRole()` creates its **own isolated state and its own Supabase API calls**. When `Onboarding.tsx` mounts, it creates fresh hook instances starting at `loading: true`. `DashboardLayout.tsx` does the same. `Dashboard.tsx` does the same. This means:
- Multiple simultaneous DB queries for the same user's role
- Each query can return different results due to timing
- The loading/loaded states flicker between components independently

### Problem 3 — Redirect chain creates loops
```text
/dashboard → (role=null briefly) → /onboarding
/onboarding → (role=instructor) → /instructor
/instructor DashboardLayout → (role=student this time) → /dashboard
/dashboard → (role=null) → /onboarding
... infinite loop
```

---

## The Fix Plan

### Step 1 — Clean duplicate roles (Database fix)
Remove the duplicate role entry for the current user. The user signed up as an instructor, so we remove the `student` role and keep `instructor`. This is a one-time data fix via SQL.

### Step 2 — Create a global AuthContext (`src/contexts/AuthContext.tsx`)
Replace the fragmented `useAuth` + `useUserRole` hook pattern with a single **React Context** that wraps the entire app. This means:
- Auth state is fetched **once** at app startup
- All components share the same `user`, `role`, and `loading` values — no race conditions
- Role is fetched immediately after auth resolves, in sequence
- Role query includes `ORDER BY created_at ASC LIMIT 1` to always get the first/primary role

```text
App
└── AuthProvider (one fetch, shared state)
    ├── Dashboard (reads from context — no extra fetch)
    ├── Onboarding (reads from context — no extra fetch)  
    ├── DashboardLayout (reads from context — no extra fetch)
    └── All other pages
```

### Step 3 — Rewrite `useAuth` and `useUserRole` to use the context
Both hooks become simple context consumers — they read from the single global store instead of creating their own state. All existing code continues to work because the hook API (`{ user, loading }` and `{ role, loading }`) stays the same.

### Step 4 — Fix redirect logic in `Onboarding.tsx` and `Dashboard.tsx`
- `Onboarding.tsx`: Only show if user is authenticated AND has NO role. If role exists, redirect immediately. If no user, go to login.
- `Dashboard.tsx`: Pure redirect page — waits for single loading state, then routes once.
- Add `navigate` with `replace: true` everywhere to prevent back-button loops.

### Step 5 — Add role priority ordering to DB query
Change the role query to `ORDER BY created_at ASC LIMIT 1` so the first role assigned always wins, making behavior deterministic.

### Step 6 — Fix the `Skeleton` ref warning in `InstructorDashboard`
The console shows a React warning: "Function components cannot be given refs" on `Skeleton`. This is caused by passing a `ref` directly to the `Skeleton` component. Fix by wrapping with a `div` or using `forwardRef`.

---

## Files to Change

| File | Change |
|------|--------|
| `src/contexts/AuthContext.tsx` | **NEW** — single source of truth for auth + role state |
| `src/hooks/useAuth.tsx` | Rewritten to read from context |
| `src/hooks/useUserRole.tsx` | Rewritten to read from context |
| `src/App.tsx` | Wrap with `<AuthProvider>` |
| `src/pages/Onboarding.tsx` | Fix redirect logic, remove redundant loading |
| `src/pages/Dashboard.tsx` | Simplified redirect logic using shared context |
| `src/components/dashboard/DashboardLayout.tsx` | Uses shared context, no extra fetches |
| `src/pages/instructor/InstructorDashboard.tsx` | Fix Skeleton ref warning |

---

## Database Fix (runs first)

```sql
-- Remove duplicate student role for user who is an instructor
-- Keep only the earliest assigned role per user
DELETE FROM user_roles
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM user_roles
  ORDER BY user_id, created_at ASC
);
```

This ensures every user has exactly one role — whichever they first selected.

---

## Technical Implementation Detail

The new `AuthContext` will:
1. Set up `onAuthStateChange` listener FIRST (as required by Supabase best practices)
2. Call `getSession()` to hydrate immediately
3. Once `user` is known, fetch the role with `ORDER BY created_at ASC LIMIT 1`
4. Expose `{ user, role, loading, isAuthLoading, isRoleLoading }` to all consumers
5. Include a `refreshRole()` function so `Onboarding.tsx` can trigger a re-fetch after saving a new role, instead of navigating to `/dashboard` and hoping for the best

After `handleContinue` saves the role successfully, it will call `refreshRole()` then navigate directly to the correct dashboard — skipping the `/dashboard` redirect entirely.
