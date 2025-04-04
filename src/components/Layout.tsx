
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MeetingProvider } from "@/contexts/MeetingContext";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, LogOut, Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  // Nav items for authenticated users
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Clock className="h-4 w-4 mr-2" /> },
    { label: "Schedule Meeting", path: "/schedule", icon: <CalendarDays className="h-4 w-4 mr-2" /> },
    { label: "Upcoming Meetings", path: "/upcoming", icon: <Clock className="h-4 w-4 mr-2" /> },
  ];

  return (
    <MeetingProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Navigation */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <CalendarDays className="h-6 w-6 text-brand-600" />
              <span className="font-bold text-xl">MeetSync</span>
            </Link>

            {/* Mobile menu button */}
            <button 
              className="flex md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {isAuthenticated && !isAuthPage && !isHomePage && (
                <div className="flex items-center gap-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                        location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                !isAuthPage && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                      <Link to="/signin">Sign in</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </div>
                )
              )}
            </nav>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t p-4 bg-background animate-fade-in">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center mb-4">
                    <User className="h-5 w-5 mr-2" />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <div className="space-y-3">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center py-2 text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                    <button 
                      className="flex items-center py-2 text-sm font-medium text-destructive w-full"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline">
                    <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 MeetSync. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Contact Us
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </MeetingProvider>
  );
};

export default Layout;
