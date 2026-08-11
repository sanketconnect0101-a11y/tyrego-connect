import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, ScreenHeader } from "@/components/MobileShell";
import { recentJobs } from "@/lib/mock-data";
import { ChevronRight, IndianRupee } from "lucide-react";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

const TABS = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
] as const;

function JobsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("active");
  const filtered = recentJobs.filter((j) => j.status === tab);

  return (
    <MobileShell>
      <ScreenHeader title="Jobs" />
      <div className="sticky top-[68px] z-20 flex gap-1 bg-background/95 px-5 py-3 backdrop-blur">
        {TABS.map((t) => {
          const count = recentJobs.filter(j => j.status === t.id).length;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${active ? "bg-primary text-primary-foreground shadow-elevated" : "text-muted-foreground"}`}
            >
              {t.label} {count > 0 && <span className={active ? "opacity-80" : ""}>({count})</span>}
            </button>
          );
        })}
      </div>

      <div className="space-y-3 px-5 pb-6">
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-card p-10 text-center">
            <div className="text-5xl">📭</div>
            <div className="mt-3 font-bold">No {tab} jobs</div>
            <div className="text-xs text-muted-foreground">They'll appear here</div>
          </div>
        )}
        {filtered.map((j) => {
          const to = j.status === "completed" ? "/job/$id/summary" : j.status === "cancelled" ? "/job/$id/cancelled" : "/job/$id";
          return (
          <Link to={to} params={{ id: j.id }} key={j.id} className="block rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{j.id}</div>
                <div className="mt-0.5 text-base font-bold">{j.problem}</div>
                <div className="text-xs text-muted-foreground">{j.customer} • {j.vehicle}</div>
              </div>
              <StatusPill status={j.status} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="text-xs text-muted-foreground">{j.staff || "—"} • {j.time}</div>
              <div className="flex items-center gap-1">
                <span className="flex items-center text-base font-extrabold"><IndianRupee className="h-3.5 w-3.5" />{j.amount}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </MobileShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-warning/15 text-warning-foreground",
    completed: "bg-success/15 text-success",
    cancelled: "bg-destructive/15 text-destructive",
  };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${map[status]}`}>{status}</span>;
}
