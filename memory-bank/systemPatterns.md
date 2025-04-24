# System Patterns

This file documents the system architecture, key technical decisions, design patterns in use, and component relationships.

**System Architecture:**

*   The project follows a component-based architecture using React.
*   UI components are organized in the `src/components/` directory, with a focus on reusable UI elements in `src/components/ui/`.
*   The application uses a context-based approach for managing authentication and theme settings.
*   Supabase is used for backend services, providing database and authentication functionality.

**Key Technical Decisions:**

*   Using React for the UI framework.
*   Using TypeScript for type safety and improved code maintainability.
*   Using Tailwind CSS for styling and UI design.
*   Using Vite as the bundler for fast development and build times.
*   Using Supabase for backend services.

**Design Patterns:**

*   Component-based architecture.
*   Context API for state management.
*   Higher-order components for protected routes (AdminProtectedRoute, ProtectedRoute).

**Component Relationships:**

*   App.tsx is the main application component.
*   NavBar and Footer are used for navigation and footer elements.
*   AdminLayout and AdminSidebar provide the layout for admin pages.
*   UserAdminManager manages user administration functionality.

**Critical Implementation Paths:**

*   Authentication flow using AuthContext.
*   Theme management using ThemeContext.
*   Data fetching and management using Supabase client.
