import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PropertyListing from "@/pages/PropertyListing";
import PropertyDetail from "@/pages/PropertyDetail";
import ProjectDetail from "@/pages/ProjectDetail";
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import { API_BASE_URL } from "./lib/config";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties" component={PropertyListing} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Debug the API URL - remove this in production
  console.log('API_BASE_URL from config:', API_BASE_URL);
  
  // Get current location to conditionally render header/footer/chatbot
  const [location] = useLocation();
  const isLoginPage = location === '/login';
  const isAdminPage = location === '/admin' || location.startsWith('/admin/');
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        {!isLoginPage && <Header />}
        <main className="flex-grow">
          <Router />
        </main>
        {!isLoginPage && <Footer />}
        {!isLoginPage && !isAdminPage && <Chatbot />}
        {/* Debug element to show API URL - remove this in production */}
        {import.meta.env.DEV && (
          <div style={{ position: 'fixed', bottom: '10px', right: '10px', background: 'black', color: 'white', padding: '5px', zIndex: 9999 }}>
            API URL: {API_BASE_URL || 'not set'}
          </div>
        )}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
