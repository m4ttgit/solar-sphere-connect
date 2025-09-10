
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // Add this import
import Index from "./pages/Index";
import EiaDataPage from "./pages/EiaDataPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthPage from "./pages/AuthPage";
import SubmitBusinessPage from "./pages/SubmitBusinessPage.tsx"; // Enforce .tsx resolution for Windows
// Add explicit component directory to verify path correctness
import DirectoryPage from "./pages/DirectoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutPage from "./pages/AboutPage";
import ArticlePage from "./pages/ArticlePage";
import BlogPostDetail from "./pages/BlogPostDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlogPostsList from "./pages/admin/BlogPostsList";
import BlogPostForm from "./pages/admin/BlogPostForm";
import BusinessListPage from "./pages/admin/BusinessListPage";
import BusinessDetailsPage from "./pages/admin/BusinessDetailsPage";
import ContactsListPage from "./pages/admin/ContactsListPage";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import ComparisonPage from "./pages/ComparisonPage";
import SolarSystemToolsPage from "./pages/SolarSystemToolsPage";
import ShopPage from "./pages/ShopPage";

// Ensure no duplicate SubmitBusinessPage imports
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Clear cache on app start to fetch fresh data after table changes
queryClient.clear();

const App = () => {
  const location = window.location.pathname;
  console.log('Current route:', location);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HelmetProvider> {/* Add this provider */}
          <TooltipProvider>
            <ThemeProvider>
              <AuthProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/directory" element={<DirectoryPage />} />
                  <Route path="/directory/:name_slug" element={<CompanyDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/blog" element={<ArticlePage />} />
                  <Route path="/blog/:slug" element={<BlogPostDetail />} />
                  <Route
                    path="/submit"
                    element={
                      <ProtectedRoute>
                        <SubmitBusinessPage />
                    </ProtectedRoute>
                    }
                  />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <AdminProtectedRoute>
                        <AdminDashboard />
                      </AdminProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/posts" 
                    element={
                      <AdminProtectedRoute>
                        <BlogPostsList />
                      </AdminProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/posts/new" 
                    element={
                      <AdminProtectedRoute>
                        <BlogPostForm />
                      </AdminProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/posts/edit/:slug" 
                    element={
                      <AdminProtectedRoute>
                        <BlogPostForm />
                      </AdminProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/businesses" 
                    element={
                      <AdminProtectedRoute>
                        <BusinessListPage />
                      </AdminProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/businesses/:id" 
                    element={
                      <AdminProtectedRoute>
                        <BusinessDetailsPage />
                      </AdminProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/contacts" 
                    element={
                      <AdminProtectedRoute>
                        <ContactsListPage />
                      </AdminProtectedRoute>
                    } 
                  />
                  {/* Password Reset Routes */}
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/update-password" element={<UpdatePasswordPage />} />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="/compare" element={<ComparisonPage />} /> {/* Add this route */}
                  <Route path="/solar-tools" element={<SolarSystemToolsPage />} />
                  <Route path="/eia-data" element={<EiaDataPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="*" element={<NotFound />} />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </AuthProvider>
            </ThemeProvider>
          </TooltipProvider>
        </HelmetProvider> {/* Close the provider */}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
