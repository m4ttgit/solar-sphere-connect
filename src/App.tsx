
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // Add this import
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthPage from "./pages/AuthPage";
import SubmitBusinessPage from "./pages/SubmitBusinessPage";
import DirectoryPage from "./pages/DirectoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutPage from "./pages/AboutPage";
import ArticlePage from "./pages/ArticlePage";
import BlogPostDetail from "./pages/BlogPostDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlogPostsList from "./pages/admin/BlogPostsList";
import BlogPostForm from "./pages/admin/BlogPostForm";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ComparisonPage from "./pages/ComparisonPage"; // Add this import

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
                  <Route path="/blog/:id" element={<BlogPostDetail />} />
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
                    path="/admin" 
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
                    path="/admin/posts/edit/:id" 
                    element={
                      <AdminProtectedRoute>
                        <BlogPostForm />
                      </AdminProtectedRoute>
                    } 
                  />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="/compare" element={<ComparisonPage />} /> {/* Add this route */}
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
