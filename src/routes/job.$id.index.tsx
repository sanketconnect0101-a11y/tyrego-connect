import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { staffList, incomingLeads, recentJobs } from "@/lib/mock-data";
import { MapPin, Phone, Clock, Navigation, IndianRupee, User } from "lucide-react";

export const Route = createFileRoute("/job/$id/")({ component: JobDetail });

function JobDetail() {
  const { id } = Route.useParams();
  const lead = incomingLeads.find((l) => l.id === id);
  const job = recentJobs.find((j) => j.id === id);
  const data = lead ?? (job ? {
    id: job.id, vehicle: job.vehicle, vehicleIcon: "🚗", problem: job.problem, location: "Andheri East", distanceKm: 2.1, etaMin: 10, amount: job.amount, customerName: job.customer, customerPhone: "+91 98xxx xxxxx"
  } : null);

  const [showAssign, setShowAssign] = useState(false);
  const [assigned, setAssigned] = useState<string | null>(null);
  const [selfHandle, setSelfHandle] = useState(false);
  const [hasStaff, setHasStaff] = useState(true);

  useEffect(() => {
    try {
      const c = localStorage.getItem("autoxpert_staff_count");
      if (c !== null) setHasStaff(parseInt(c, 10) > 0);
    } catch {}
  }, []);

  if (!data) return <div className="p-10 text-center">Job not found</div>;

  const ready = assigned || selfHandle;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Job Details" back />

      {/* Map preview */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-soft via-accent to-background">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.55 0.24 295 / 0.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.55 0.24 295 / 0.3) 0%, transparent 40%)"
        }} />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" fill="none">
          <path d="M40 160 Q 140 100 200 110 T 360 60" stroke="oklch(0.55 0.24 295)" strokeWidth="3" strokeDasharray="6 4" />
          <circle cx="40" cy="160" r="8" fill="oklch(0.55 0.24 295)" />
          <circle cx="360" cy="60" r="10" fill="oklch(0.62 0.24 25)" />
        </svg>
        <div className="absolute bottom-3 left-3 rounded-xl bg-card/95 px-3 py-2 shadow-card backdrop-blur">
          <div className="flex items-center gap-2 text-xs font-bold"><Navigation className="h-3 w-3 text-primary" />{data.distanceKm} km • {data.etaMin} min</div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* Vehicle / problem */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-3xl">{data.vehicleIcon}</div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold uppercase tracking-wide text-primary">{data.vehicle}</div>
              <div className="text-base font-bold">{data.problem}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{data.location}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center font-extrabold"><IndianRupee className="h-4 w-4" />{data.amount}</div>
              <div className="text-[10px] text-muted-foreground">Estimate</div>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Customer</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary font-bold">{data.customerName.charAt(0)}</div>
            <div className="flex-1">
              <div className="font-bold">{data.customerName}</div>
              <div className="text-xs text-muted-foreground">{data.customerPhone}</div>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-success-foreground">
              <Phone className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Handle / Assign */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Job Handler</div>
            {ready && <button onClick={() => { setAssigned(null); setSelfHandle(false); }} className="text-xs font-bold text-primary">Change</button>}
          </div>

          {assigned ? (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary font-bold text-primary-foreground">
                {staffList.find(s => s.id === assigned)?.avatar}
              </div>
              <div className="flex-1">
                <div className="font-bold">{staffList.find(s => s.id === assigned)?.name}</div>
                <div className="text-xs text-success">Assigned • on the way</div>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          ) : selfHandle ? (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold">Self Handle</div>
                <div className="text-xs text-success">You'll handle this job yourself</div>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {hasStaff && (
                <button onClick={() => setShowAssign(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary-soft py-3 font-bold text-primary">
                  + Assign to Staff
                </button>
              )}
              <button onClick={() => setSelfHandle(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-card py-3 font-bold text-foreground">
                <User className="h-4 w-4" /> Handle Yourself
              </button>
              {!hasStaff && (
                <p className="text-center text-[11px] text-muted-foreground">No staff added — you'll handle this job</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur safe-bottom">
        {ready ? (
          <Link to="/job/$id/navigate" params={{ id: data.id }} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated">
            <Navigation className="h-5 w-5" /> Start Job
          </Link>
        ) : (
          <button onClick={() => hasStaff ? setShowAssign(true) : setSelfHandle(true)} className="w-full rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated">
            {hasStaff ? "Assign or Self Handle" : "Tap to Start Job"}
          </button>
        )}
      </div>

      {showAssign && (
        <AssignSheet
          onClose={() => setShowAssign(false)}
          onAssign={(id) => { setAssigned(id); setShowAssign(false); }}
        />
      )}
    </div>
  );
}

function AssignSheet({ onClose, onAssign }: { onClose: () => void; onAssign: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-foreground/40 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
        <h3 className="text-xl font-bold">Assign Staff</h3>
        <p className="text-xs text-muted-foreground">Select an available team member</p>
        <div className="mt-5 max-h-[60vh] space-y-2 overflow-y-auto">
          {staffList.filter(s => s.active).map((s) => (
            <button key={s.id} onClick={() => onAssign(s.id)} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition active:scale-[0.99]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary font-bold text-primary-foreground">{s.avatar}</div>
              <div className="flex-1">
                <div className="font-bold">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.vehicles.join(" • ")}</div>
                <div className="text-[11px] text-success">📍 {s.distanceKm} km away</div>
              </div>
              <div className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">Assign</div>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full rounded-2xl border border-border py-3 font-bold text-muted-foreground safe-bottom">Cancel</button>
      </div>
    </div>
  );
}
