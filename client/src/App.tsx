import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ParticleBackground from "./components/ParticleBackground";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Interests from "./pages/Interests";
import Archive from "./pages/Archive";
import { AnimatePresence } from "framer-motion";
import { useScrollToTop } from "./hooks/useScrollToTop";

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/interests" component={Interests} />
        <Route path="/archive" component={Archive} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  useScrollToTop();
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {/* Particle background — fixed, behind everything */}
          <ParticleBackground />
          {/* Sticky nav */}
          <Navbar />
          {/* Page content */}
          <div className="relative z-10 pt-16 min-h-screen" style={{ background: 'transparent' }}>
            <Router />
            <Footer />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
