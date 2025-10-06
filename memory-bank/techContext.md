# Tech Context

This file lists technologies and frameworks used, describes the development setup, notes technical constraints, and records dependencies and tool configurations.

**Technologies and Frameworks:**

*   React: v18.3.1
*   TypeScript: v5.5.3
*   Tailwind CSS: v3.4.11
*   Vite: v5.4.1
*   Supabase: v2.49.8

**Dependencies:**

*   @hookform/resolvers: v3.9.0
*   @radix-ui/react-accordion: v1.2.0
*   @radix-ui/react-alert-dialog: v1.1.1
*   @radix-ui/react-aspect-ratio: v1.1.0
*   @radix-ui/react-avatar: v1.1.0
*   @radix-ui/react-checkbox: v1.1.1
*   @radix-ui/react-collapsible: v1.1.0
*   @radix-ui/react-context-menu: v2.2.1
*   @radix-ui/react-dialog: v1.1.2
*   @radix-ui/react-dropdown-menu: v2.1.1
*   @radix-ui/react-hover-card: v1.1.1
*   @radix-ui/react-label: v2.1.0
*   @radix-ui/react-menubar: v1.1.1
*   @radix-ui/react-navigation-menu: v1.2.0
*   @radix-ui/react-popover: v1.1.1
*   @radix-ui/react-progress: v1.1.0
*   @radix-ui/react-radio-group: v1.2.0
*   @radix-ui/react-scroll-area: v1.1.0
*   @radix-ui/react-select: v2.1.1
*   @radix-ui/react-separator: v1.1.0
*   @radix-ui/react-slider: v1.2.0
*   @radix-ui/react-slot: v1.1.0
*   @radix-ui/react-switch: v1.1.0
*   @radix-ui/react-tabs: v1.1.0
*   @radix-ui/react-toast: v1.2.1
*   @radix-ui/react-toggle: v1.1.0
*   @radix-ui/react-toggle-group: v1.1.0
*   @radix-ui/react-tooltip: v1.1.4
*   @supabase/supabase-js: v2.49.8
*   @tanstack/react-query: v5.56.2
*   class-variance-authority: v0.7.1
*   clsx: v2.1.1
*   cmdk: v1.0.0
*   date-fns: v3.6.0
*   embla-carousel-react: v8.3.0
*   iconv-lite: v0.6.3
*   input-otp: v1.2.4
*   lucide-react: v0.462.0
*   next-themes: v0.3.0
*   react: v18.3.1
*   react-day-picker: v8.10.1
*   react-dom: v18.3.1
*   react-error-boundary: v6.0.0
*   react-helmet-async: v2.0.5
*   react-hook-form: v7.53.0
*   react-resizable-panels: v2.1.3
*   react-router-dom: v6.26.2
*   recharts: v2.12.7
*   sonner: v1.5.0
*   tailwind-merge: v2.5.2
*   tailwindcss-animate: v1.0.7
*   unidecode: v1.1.0
*   vaul: v0.9.3
*   zod: v3.23.8

**Dev Dependencies:**

*   @eslint/js: v9.9.0
*   @tailwindcss/typography: v0.5.15
*   @types/node: v22.15.29
*   @types/react: v18.3.3
*   @types/react-dom: v18.3.0
*   @vitejs/plugin-react-swc: v3.5.0
*   autoprefixer: v10.4.20
*   eslint: v9.9.0
*   eslint-plugin-react-hooks: v5.1.0-rc.0
*   eslint-plugin-react-refresh: v0.4.9
*   globals: v15.9.0
*   postcss: v8.4.47
*   tailwindcss: v3.4.11
*   typescript: v5.5.3
*   typescript-eslint: v8.0.1
*   vite: v5.4.1

**Components:**

*   **Custom Components:**
    *   AdminProtectedRoute.tsx
    *   CompanyImage.tsx
    *   Footer.tsx
    *   NavBar.tsx
    *   ProtectedRoute.tsx
*   **Admin Components:**
    *   AdminLayout.tsx
    *   AdminSidebar.tsx
    *   UserAdminManager.tsx
*   **UI Components (Shadcn UI):**
    *   accordion.tsx
    *   alert-dialog.tsx
    *   alert.tsx
    *   aspect-ratio.tsx
    *   avatar.tsx
    *   badge.tsx
    *   breadcrumb.tsx
    *   button.tsx
    *   calendar.tsx
    *   card.tsx
    *   carousel.tsx
    *   chart.tsx
    *   checkbox.tsx
    *   collapsible.tsx
    *   command.tsx
    *   context-menu.tsx
    *   dialog.tsx
    *   drawer.tsx
    *   dropdown-menu.tsx
    *   form.tsx
    *   hover-card.tsx
    *   input-otp.tsx
    *   input.tsx
    *   label.tsx
    *   menubar.tsx
    *   navigation-menu.tsx
    *   pagination.tsx
    *   popover.tsx
    *   progress.tsx
    *   radio-group.tsx
    *   resizable.tsx
    *   scroll-area.tsx
    *   select.tsx
    *   separator.tsx
    *   sheet.tsx
    *   sidebar.tsx
    *   skeleton.tsx
    *   slider.tsx
    *   sonner.tsx
    *   switch.tsx
    *   table.tsx
    *   tabs.tsx
    *   textarea.tsx
    *   toast.tsx
    *   toaster.tsx
    *   toggle-group.tsx
    *   toggle.tsx
    *   tooltip.tsx
    *   use-toast.ts

**Development Setup:**

*   Node.js and npm/yarn for package management.
*   Vite for local development server and build process.
*   Supabase CLI for local Supabase development and migrations.
*   Deno runtime for Supabase Edge Functions development.
*   VS Code with relevant extensions for React, TypeScript, and Tailwind CSS.

**Technical Constraints:**

*   Client-side rendering for the main application.
*   Supabase as the primary backend for database, authentication, and edge functions.
*   Real-time features are dependent on Supabase Realtime.
*   Performance considerations for large datasets will require pagination and efficient querying.
*   Email notifications dependent on Resend API service availability.

**Edge Functions & External Integrations:**

*   **Supabase Edge Functions:** Deno-based serverless functions for contact form processing.
*   **Resend API:** Email service for automated notifications to administrators.
*   **Contact Form Processing:** Server-side validation, database storage, and email notifications.

**Tool Configurations:**

*   Vite for bundling and development server.
*   Tailwind CSS for utility-first styling.
*   ESLint for code linting.
*   TypeScript for type checking.
*   Shadcn UI for pre-built, customizable UI components.
