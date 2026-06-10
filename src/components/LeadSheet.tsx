import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Clock, IndianRupee, X, Zap } from "lucide-react";
import type { Lead } from "@/lib/mock-data";

export function LeadSheet({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-md animate-sheet-up overflow-hidden rounded-t-3xl bg-card shadow-sheet">
        {/* Header strip */}
        <div className="bg-gradient-hero relative px-5 pb-5 pt-4 text-white">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/40" />
          <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-warning px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-warning-foreground">
              <Zap className="h-3 w-3" /> High Priority
            </span>
            <span className="text-xs font-medium text-white/80">Expires in {seconds}s</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold">New Lead</h2>
          <p className="text-sm text-white/80">{lead.id} • Just now</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(seconds / 30) * 100}%` }} />
          </div>
        </div>

        <div className="space-y-4 px-5 pb-5 pt-5">
          {/* Vehicle + Problem */}
          <div className="flex items-start gap-3 rounded-2xl bg-primary-soft p-4">
            <div className="text-4xl">{lead.vehicleIcon}</div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">{lead.vehicle}</div>
              <div className="mt-0.5 text-base font-semibold leading-snug">{lead.problem}</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            <Stat icon={<MapPin className="h-4 w-4" />} label="Distance" value={`${lead.distanceKm} KM`} />
            <Stat icon={<Clock className="h-4 w-4" />} label="Reach" value={`${lead.etaMin} min`} />
            <Stat icon={<IndianRupee className="h-4 w-4" />} label="Earn" value={`₹${lead.amount}`} highlight />
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-muted-foreground">Pickup location</div>
              <div className="truncate text-sm font-semibold">{lead.location}</div>
            </div>
          </div>

          {/* Promo */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-accent p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏆</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-foreground">Accept more leads, earn more</div>
                <div className="text-xs text-muted-foreground">3 more accepts unlocks Gold tier bonus</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-5 gap-3 pt-1">
            <button onClick={onClose} className="col-span-2 rounded-2xl border border-border bg-card py-4 text-sm font-semibold text-muted-foreground active:scale-[0.98] transition">
              Ignore
            </button>
            <Link
              to="/job/$id"
              params={{ id: lead.id }}
              className="col-span-3 flex items-center justify-center rounded-2xl bg-gradient-primary py-4 text-sm font-bold text-primary-foreground shadow-elevated active:scale-[0.98] transition"
            >
              Accept Lead • ₹{lead.amount}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-3 ${highlight ? "border-primary/30 bg-primary-soft" : "border-border bg-card"}`}>
      <div className={`flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide ${highlight ? "text-primary" : "text-muted-foreground"}`}>
        {icon} {label}
      </div>
      <div className={`mt-1 text-base font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
