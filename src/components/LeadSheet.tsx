import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Clock, IndianRupee, X, Zap, Image as ImageIcon } from "lucide-react";
import type { Lead } from "@/lib/mock-data";

export function LeadSheet({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md animate-scale-in overflow-hidden rounded-3xl bg-card shadow-sheet">
        {/* Header */}
        <div className="bg-gradient-hero relative px-5 pb-4 pt-4 text-white">
          <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-warning px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-warning-foreground">
              <Zap className="h-3 w-3" /> High Priority
            </span>
            <span className="text-xs font-medium text-white/80">Expires in {seconds}s</span>
          </div>
          <h2 className="mt-2 text-xl font-bold">New Lead</h2>
          <p className="text-xs text-white/80">{lead.id} • Just now</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(seconds / 30) * 100}%` }} />
          </div>
        </div>

        <div className="space-y-3 px-5 pb-5 pt-4">
          {/* Vehicle + Problem */}
          <div className="flex items-start gap-3 rounded-2xl bg-primary-soft p-3">
            <div className="text-3xl">{lead.vehicleIcon}</div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">{lead.vehicle}</div>
              <div className="mt-0.5 text-sm font-semibold leading-snug">{lead.problem}</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            <Stat icon={<MapPin className="h-4 w-4" />} label="Distance" value={`${lead.distanceKm} KM`} />
            <Stat icon={<Clock className="h-4 w-4" />} label="Reach" value={`${lead.etaMin} min`} />
            <Stat icon={<IndianRupee className="h-4 w-4" />} label="Earn" value={`₹${lead.amount}`} highlight />
          </div>

          {/* Customer photo preview */}
          {lead.photo && (
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="flex items-center justify-between bg-secondary px-3 py-1.5 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-muted-foreground"><ImageIcon className="h-3 w-3" /> Customer sent photo</span>
              </div>
              <img src={lead.photo} alt="Problem" className="h-32 w-full object-cover" />
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium text-muted-foreground">Pickup location</div>
              <div className="truncate text-xs font-semibold">{lead.location}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            <button onClick={onClose} className="col-span-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-muted-foreground active:scale-[0.98] transition">
              Ignore
            </button>
            <Link
              to="/job/$id"
              params={{ id: lead.id }}
              className="col-span-3 flex items-center justify-center rounded-2xl bg-gradient-primary py-3.5 text-sm font-bold text-primary-foreground shadow-elevated active:scale-[0.98] transition"
            >
              Accept • ₹{lead.amount}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-2.5 ${highlight ? "border-primary/30 bg-primary-soft" : "border-border bg-card"}`}>
      <div className={`flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide ${highlight ? "text-primary" : "text-muted-foreground"}`}>
        {icon} {label}
      </div>
      <div className={`mt-0.5 text-sm font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
