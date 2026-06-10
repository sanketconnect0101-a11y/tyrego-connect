import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, MapPin, Clock, IndianRupee, ChevronRight, Briefcase, Users, TrendingUp } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { LeadSheet } from "@/components/LeadSheet";
import { incomingLeads, recentJobs } from "@/lib/mock-data";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const [online, setOnline] = useState(true);
  const [activeLead, setActiveLead] = useState<string | null>(null);
  const lead = incomingLeads.find((l) => l.id === activeLead);
  const activeJobs = recentJobs.filter((j) => j.status === "active");

  return (
    <MobileShell>
      {/* Header */}
      <header className="bg-gradient-hero px-5 pb-6 pt-12 text-white safe-top">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-white/80">Good Morning 👋</div>
            <h1 className="mt-0.5 text-xl font-extrabold">Sharma Tyre Works</h1>
          </div>
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Bell className="h-5 w-5" />
            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-warning" />
          </button>
        </div>
        {/* Online toggle */}
        <button
          onClick={() => setOnline(!online)}
          className={`mt-5 flex w-full items-center justify-between rounded-2xl p-3 transition ${online ? "bg-white/15" : "bg-foreground/30"} backdrop-blur`}
        >
          <div className="flex items-center gap-3">
            <div className={`relative flex h-3 w-3 items-center justify-center rounded-full ${online ? "bg-success" : "bg-white/40"}`}>
              {online && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />}
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">{online ? "You're Online" : "You're Offline"}</div>
              <div className="text-[11px] text-white/70">{online ? "Receiving new leads" : "Tap to start receiving leads"}</div>
            </div>
          </div>
          <div className={`relative h-7 w-12 rounded-full transition ${online ? "bg-success" : "bg-white/20"}`}>
            <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${online ? "left-[22px]" : "left-0.5"}`} />
          </div>
        </button>
      </header>

      {/* Stats */}
      <div className="-mt-4 grid grid-cols-3 gap-2 px-5">
        <StatCard icon={<Briefcase className="h-4 w-4" />} value={activeJobs.length.toString()} label="Active Jobs" />
        <StatCard icon={<Users className="h-4 w-4" />} value="3" label="Staff Free" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} value="₹2.4k" label="Today" />
      </div>

      {/* Hero banner */}
      <div className="px-5 pt-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-accent to-primary-soft p-5">
          <div className="max-w-[60%]">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">Earn More</div>
            <h3 className="mt-1 text-lg font-extrabold leading-tight text-foreground">Accept More Leads, Earn More</h3>
            <p className="mt-1 text-xs text-muted-foreground">Top 10% merchants earn ₹50k+ /month</p>
            <button className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
              Know More <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="absolute -bottom-2 -right-2 text-8xl opacity-90">🛠️</div>
        </div>
      </div>

      {/* Incoming Leads */}
      <section className="px-5 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold">Incoming Leads</h2>
          <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-bold text-destructive">
            {incomingLeads.length} New
          </span>
        </div>
        <div className="space-y-3">
          {incomingLeads.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLead(l.id)}
              className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-card transition active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-3xl">{l.vehicleIcon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">{l.vehicle}</span>
                    {l.priority === "high" && <span className="rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-bold uppercase text-warning-foreground">Urgent</span>}
                  </div>
                  <div className="mt-0.5 truncate text-sm font-bold">{l.problem}</div>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{l.distanceKm} km</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{l.etaMin} min</span>
                    <span className="ml-auto flex items-center gap-0.5 font-bold text-foreground"><IndianRupee className="h-3 w-3" />{l.amount}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="flex-1 rounded-xl border border-border py-2 text-center text-xs font-semibold text-muted-foreground">Ignore</div>
                <div className="flex-[2] rounded-xl bg-gradient-primary py-2 text-center text-xs font-bold text-primary-foreground">View Lead →</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Active Jobs */}
      <section className="px-5 pb-6 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold">Active Jobs</h2>
          <Link to="/jobs" className="text-xs font-bold text-primary">View all →</Link>
        </div>
        <div className="space-y-2">
          {activeJobs.map((j) => (
            <Link to="/job/$id" params={{ id: j.id }} key={j.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/15 text-warning-foreground">
                <div className="h-2 w-2 animate-pulse rounded-full bg-warning" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{j.problem}</div>
                <div className="text-xs text-muted-foreground">{j.customer} • {j.vehicle} • {j.staff}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">₹{j.amount}</div>
                <div className="text-[10px] text-muted-foreground">{j.time}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {lead && <LeadSheet lead={lead} onClose={() => setActiveLead(null)} />}
    </MobileShell>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary">{icon}</div>
      <div className="mt-2 text-lg font-extrabold">{value}</div>
      <div className="text-[10px] font-medium text-muted-foreground">{label}</div>
    </div>
  );
}
