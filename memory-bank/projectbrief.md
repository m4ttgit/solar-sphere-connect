# Project Brief: Solar Sphere Connect

## Overview
Solar Sphere Connect is a web application designed to connect users with solar energy providers and related services. It aims to be a comprehensive platform for discovering, comparing, and engaging with solar companies, as well as providing educational content through a blog. The application features user authentication, an administrative dashboard for content management, and a directory of solar businesses with detailed company pages.

## Core Requirements and Goals
- **User Authentication:** Secure user registration, login, and password management.
- **Business Directory:** A searchable and filterable directory of solar companies.
- **Company Profiles:** Detailed pages for each company, including contact information, services, and potentially reviews.
- **Contact Form System:** Customer inquiry form with email notifications and admin management interface.
- **Blog/Article Section:** A content management system for publishing articles related to solar energy.
- **Admin Dashboard:** Tools for administrators to manage users, blog posts, company listings, and customer inquiries.
- **Comparison Tool:** Functionality to compare different solar providers or solutions.
- **Responsive Design:** Ensure the application is accessible and functional across various devices.
- **Scalability:** Built on a robust backend (Supabase) to handle future growth.

## Technologies Used
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL, Authentication, Storage, Edge Functions)
- **State Management:** React Context API, React Query (for data fetching)
- **Routing:** React Router DOM
- **Deployment:** Vercel (or similar)

## Project File Structure

```
.
├── .gitignore
├── blog_post.json
├── checkweb.py
├── components.json
├── current_issues_report.md
├── eslint.config.js
├── index.html
├── Option1_Supabase_Fix.md
├── package-lock.json
├── package.json
├── post_blog.py
├── postcss.config.js
├── public.slugify
├── README.md
├── solar_contacts_with_validity.csv
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vite.config.ts.timestamp-1748250519310-f3c4fb545f9c8.mjs
├── memory-bank/
│   ├── activeContext.md
│   ├── continue.md
│   ├── memory_index.md
│   ├── productContext.md
│   ├── progress.md
│   ├── projectbrief.md
│   ├── systemPatterns.md
│   └── techContext.md
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   ├── robots.txt
│   └── processed_screenshots/
│       ├── 1_By_1_Roof_Solar_&_Paint.jpg
│       ├── ... (truncated for brevity, contains many image files)
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── tmp.ts
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── AdminProtectedRoute.tsx
│   │   ├── CompanyImage.tsx
│   │   ├── NavBar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── admin/
│   │       ├── AdminLayout.tsx
│   │       ├── AdminSidebar.tsx
│   │       ├── BlogPostForm.tsx
│   │       └── UserAdminManager.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── database/
│   ├── hooks/
│   │   ├── useAdmin.ts
│   │   └── useAuth.ts
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── ArticlePage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── BlogPostDetail.tsx
│   │   ├── CompanyDetailPage.tsx
│   │   ├── ComparisonPage.tsx
│   │   ├── DirectoryPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── SubmitBusinessPage.tsx
│   │   ├── UpdatePasswordPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       └── BlogPostsList.tsx
│   ├── types/
│   │   └── blog.ts
│   └── utils/
│       └── adminUtils.ts
├── supabase/
│   ├── config.toml
│   └── functions/
│       └── submit-blog/
│           ├── BLOG_API_USAGE.md
│           ├── deno.json
│           └── index.ts
└── utility_scripts/
    └── check_websites_with_progress.py
