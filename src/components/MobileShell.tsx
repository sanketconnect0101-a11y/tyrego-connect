import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, Briefcase, User } from "lucide-react";

export function MobileShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <main className={`flex-1 ${hideNav ? "" : "pb-24"}`}>{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/staff", label: "Staff", icon: Users },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-card/95 backdrop-blur-lg safe-bottom">
      <div className="grid grid-cols-4 px-2 pt-2">
        {tabs.map((t) => {
          const active = pathname === t.to || pathname.startsWith(t.to + "/");
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="flex flex-col items-center gap-1 py-2 transition-colors"
            >
              <div className={`flex h-10 w-14 items-center justify-center rounded-xl transition-all ${active ? "bg-primary-soft text-primary" : "text-muted-foreground"}`}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-[11px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function ScreenHeader({ title, back, right }: { title: string; back?: boolean; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-4 backdrop-blur-lg safe-top">
      <div className="flex items-center gap-3">
        {back && (
          <Link to="/home" className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </Link>
        )}
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
      </div>
      {right}
    </header>
  );
}
