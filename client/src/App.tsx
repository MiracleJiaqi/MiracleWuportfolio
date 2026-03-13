import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import ParticleBackground from "./components/ParticleBackground";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Interests from "./pages/Interests";
import Connect from "./pages/Connect";
import { AnimatePresence } from "framer-motion";
function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/interests" component={Interests} />
        <Route path="/connect" component={Connect} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
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
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
