# Active Context

This file contains the current work focus, recent changes, active decisions, important patterns, and learnings.

**Project Overview:**

*   The project is a web application built with React, TypeScript, Tailwind CSS, and Supabase for backend services. It uses `vite` as the bundler.
*   Key components are located in `src/components/`, including UI components in `src/components/ui/` and admin components in `src/components/admin/`.
*   The application manages authentication and theme settings using `AuthContext.tsx` and `ThemeContext.tsx` in `src/contexts/`.
*   Supabase integration is present in `src/integrations/supabase/`.
*   Admin functionality is located in `src/pages/admin/`.

**Technologies Used:**

*   React
*   TypeScript
*   Tailwind CSS
*   Vite
*   Supabase

**Key Components:**

*   UI components in `src/components/ui/` (e.g., accordion, alert, button, card)
*   Admin components in `src/components/admin/` (e.g., AdminLayout, AdminSidebar, UserAdminManager)
*   Authentication and theme contexts in `src/contexts/` (AuthContext, ThemeContext)

**Recent Changes:**

*   Updated Supabase connection to use the `solar_contacts` table instead of the `solar_businesses` table.
    *   Modified `src/integrations/supabase/types.ts` to reflect the new schema.
    *   Modified `src/types/business.ts` to use `Json[] | null` for the `services` and `certifications` properties in the `SolarBusiness` type.
    *   Modified `src/pages/DirectoryPage.tsx` to update the query and handle the new schema.

**Active Decisions:**

*   Using Supabase for backend services.

**Important Patterns:**

*   Component-based architecture.
*   Context API for state management.
*   Higher-order components for protected routes (AdminProtectedRoute, ProtectedRoute).

**Learnings:**

*   When updating Supabase table schemas, it's important to update the corresponding TypeScript types and queries to ensure type safety and prevent runtime errors.
*   When dealing with `Json` types in Supabase, it's important to handle the different possible values that can be stored in the `Json` field.
