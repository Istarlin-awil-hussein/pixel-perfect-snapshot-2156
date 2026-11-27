import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Menu, ShieldCheck, UserRound, Waypoints } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ROLE_LABELS } from "@/data/constants";
import { logout, useCurrentUser } from "@/services/auth";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/skills", label: "Skills & Credentials" },
  { to: "/readiness", label: "Work Readiness" },
  { to: "/mentorship", label: "Mentorship" },
  { to: "/resources", label: "Resources" },
  { to: "/assistant", label: "AI Assistant" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="TalentBridge home">
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-card">
        <Waypoints className="size-5" aria-hidden />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">TalentBridge</span>
    </Link>
  );
}

export function SiteHeader() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = () => {
    logout();
    setOpen(false);
    toast.success("You have been logged out.");
    void navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-primary bg-primary-soft" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-28 truncate sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <span className="block truncate">{user.name}</span>
                  <span className="block text-xs font-normal text-muted-foreground">{ROLE_LABELS[user.role]}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard"><LayoutDashboard aria-hidden /> Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile"><UserRound aria-hidden /> Edit profile</Link>
                </DropdownMenuItem>
                {user.role === "admin" ? (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><ShieldCheck aria-hidden /> Administration</Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={signOut}>
                  <LogOut aria-hidden /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display">Menu</SheetTitle>
              <nav className="mt-4 flex flex-col gap-1 px-4" aria-label="Mobile">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: n.to === "/" }}
                    className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent"
                    activeProps={{ className: "bg-primary-soft text-primary" }}
                  >
                    {n.label}
                  </Link>
                ))}
                <div className="my-2 border-t" />
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent">Dashboard</Link>
                    <button type="button" onClick={signOut} className="rounded-md px-3 py-2.5 text-left text-base font-medium hover:bg-accent">Log out</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent">Login</Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
