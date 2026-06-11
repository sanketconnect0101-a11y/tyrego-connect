import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronRight, Briefcase, Users, TrendingUp, Radio, Zap, Pencil, Check, X } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { LeadSheet } from "@/components/LeadSheet";
import { incomingLeads, recentJobs, serviceTypes } from "@/lib/mock-data";

export const Route = createFileRoute("/home")({ component: Home });

const DEFAULT_RATES: Record<string, number> = {
  puncture: 100,
  replace: 1800,
  air: 50,
  wheel: 600,
  battery: 250,
};

function Home() {
  const [online, setOnline] = useState(true);
  const [activeLead, setActiveLead] = useState<string | null>(null);
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const indexRef = useRef(0);
  const lead = incomingLeads.find((l) => l.id === activeLead);
  const activeJobs = recentJobs.filter((j) => j.status === "active");

  useEffect(() => {
    if (!online || activeLead) return;
    const t = setTimeout(() => {
      const next = incomingLeads[indexRef.current % incomingLeads.length];
      indexRef.current += 1;
      setActiveLead(next.id);
    }, 5000);
    return () => clearTimeout(t);
  }, [online, activeLead]);

  const triggerNow = () => {
    const next = incomingLeads[indexRef.current % incomingLeads.length];
    indexRef.current += 1;
    setActiveLead(next.id);
  };

  const openEdit = (id: string) => {
    setEditing(id);
    setEditValue(String(rates[id] ?? 0));
  };
  const saveEdit = () => {
    if (!editing) return;
    const v = parseInt(editValue.replace(/\D/g, "") || "0", 10);
    setRates({ ...rates, [editing]: v });
    setEditing(null);
  };

  return (
    <MobileShell>
      {/* Compact header (no toggle here) */}
      <header className="bg-gradient-hero px-5 pb-6 pt-12 text-white safe-top">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-white/80">Good Morning 👋</div>
            <h1 className="mt-0.5 text-xl font-extrabold">Sharma Auto Works</h1>
          </div>
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Bell className="h-5 w-5" />
            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-warning" />
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="-mt-4 grid grid-cols-3 gap-2 px-5">
        <StatCard icon={<Briefcase className="h-4 w-4" />} value={activeJobs.length.toString()} label="Active Jobs" />
        <StatCard icon={<Users className="h-4 w-4" />} value="3" label="Staff Free" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} value="₹2.4k" label="Today" />
      </div>

      {/* Service Rates */}
      <section className="px-5 pt-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-extrabold">Your Service Rates</h2>
          <span className="text-[11px] font-bold text-muted-foreground">Tap ✎ to edit</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {serviceTypes.map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-3 shadow-card">
              <div className="flex items-center justify-between">
                <div className="text-2xl">{s.icon}</div>
                <button onClick={() => openEdit(s.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Pencil className="h-3 w-3" />
                </button>
              </div>
              <div className="mt-1 text-xs font-semibold text-muted-foreground">{s.label}</div>
              <div className="mt-0.5 text-lg font-extrabold text-foreground">₹{rates[s.id] ?? 0}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Online/Offline toggle — moved to middle */}
      <section className="px-5 pt-5">
        <button
          onClick={() => setOnline(!online)}
          className={`flex w-full items-center justify-between rounded-3xl p-4 shadow-card transition ${online ? "bg-gradient-primary text-primary-foreground" : "bg-card text-foreground border border-border"}`}
        >
          <div className="flex items-center gap-3">
            <div className={`relative flex h-3 w-3 items-center justify-center rounded-full ${online ? "bg-white" : "bg-muted-foreground/40"}`}>
              {online && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />}
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold">{online ? "You're Online" : "You're Offline"}</div>
              <div className={`text-[11px] ${online ? "text-white/80" : "text-muted-foreground"}`}>
                {online ? "Receiving new leads nearby" : "Tap to start receiving leads"}
              </div>
            </div>
          </div>
          <div className={`relative h-7 w-12 rounded-full transition ${online ? "bg-white/30" : "bg-secondary"}`}>
            <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${online ? "left-[22px]" : "left-0.5"}`} />
          </div>
        </button>
      </section>

      {/* Waiting for leads */}
      <section className="px-5 pt-5">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 text-center shadow-card">
          {online ? (
            <>
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30" />
                <span className="absolute inline-flex h-16 w-16 rounded-full bg-primary/20" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elevated">
                  <Radio className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mt-4 text-base font-extrabold">Waiting for new leads…</h3>
              <p className="mt-1 text-xs text-muted-foreground">A popup will appear instantly when a customer requests service nearby.</p>
              <button onClick={triggerNow} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-4 py-2 text-xs font-bold text-primary">
                <Zap className="h-3.5 w-3.5" /> Simulate Lead Now
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl">😴</div>
              <h3 className="mt-3 text-base font-extrabold">You're Offline</h3>
              <p className="mt-1 text-xs text-muted-foreground">Go online to start receiving customer leads.</p>
            </>
          )}
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
                <div className="text-xs text-muted-foreground">{j.customer} • {j.vehicle} • {j.staff ?? "Self"}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">₹{j.amount}</div>
                <div className="text-[10px] text-muted-foreground">{j.time}</div>
              </div>
            </Link>
          ))}
          {activeJobs.length === 0 && (
            <div className="rounded-2xl bg-secondary p-4 text-center text-xs text-muted-foreground">No active jobs right now</div>
          )}
        </div>
      </section>

      {lead && <LeadSheet lead={lead} onClose={() => setActiveLead(null)} />}

      {/* Rate edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Edit Rate — {serviceTypes.find(s => s.id === editing)?.label}</h3>
              <button onClick={() => setEditing(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amount (₹)</label>
              <input
                autoFocus
                inputMode="numeric"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value.replace(/\D/g, ""))}
                className="mt-2 w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-2xl font-extrabold outline-none focus:border-primary"
              />
            </div>
            <button onClick={saveEdit} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated safe-bottom">
              <Check className="h-5 w-5" /> Save Rate
            </button>
          </div>
        </div>
      )}

      {/* Bottom Promo Banner */}
      <div className="px-5 pb-6">
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
