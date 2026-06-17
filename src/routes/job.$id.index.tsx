import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { staffList, incomingLeads, recentJobs } from "@/lib/mock-data";
import { MapPin, Phone, Clock, Navigation, IndianRupee, User, MessageCircle, Video, Briefcase, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/job/$id/")({ component: JobDetail });

type DataShape = {
  id: string; vehicle: string; vehicleIcon: string; problem: string;
  problemDetails?: string; photo?: string;
  location: string; distanceKm: number; etaMin: number; amount: number;
  customerName: string; customerPhone: string;
};

function JobDetail() {
  const { id } = Route.useParams();
  const lead = incomingLeads.find((l) => l.id === id);
  const job = recentJobs.find((j) => j.id === id);
  const data: DataShape | null = lead ?? (job ? {
    id: job.id, vehicle: job.vehicle, vehicleIcon: "🚗", problem: job.problem,
    location: "Andheri East", distanceKm: 2.1, etaMin: 10, amount: job.amount,
    customerName: job.customer, customerPhone: "+91 98xxx xxxxx"
  } : null);

  const [showAssign, setShowAssign] = useState(false);
  const [assigned, setAssigned] = useState<{ type: "staff" | "partner"; name: string; avatar: string } | null>(null);
  const [hasStaff, setHasStaff] = useState(true);

  useEffect(() => {
    try {
      const c = localStorage.getItem("autoxpert_staff_count");
      if (c !== null) setHasStaff(parseInt(c, 10) > 0);
    } catch {}
  }, []);

  if (!data) return <div className="p-10 text-center">Job not found</div>;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Job Details" back />

      {/* Map preview */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary-soft via-accent to-background">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" fill="none">
          <path d="M40 160 Q 140 100 200 110 T 360 60" stroke="oklch(0.55 0.24 295)" strokeWidth="3" strokeDasharray="6 4" />
          <circle cx="40" cy="160" r="8" fill="oklch(0.55 0.24 295)" />
          <circle cx="360" cy="60" r="10" fill="oklch(0.62 0.24 25)" />
        </svg>
        <div className="absolute bottom-3 left-3 rounded-xl bg-card/95 px-3 py-2 shadow-card backdrop-blur">
          <div className="flex items-center gap-2 text-xs font-bold"><Navigation className="h-3 w-3 text-primary" />{data.distanceKm} km • {data.etaMin} min</div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {/* Problem */}
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
          {data.problemDetails && (
            <p className="mt-3 rounded-xl bg-secondary p-3 text-xs leading-relaxed text-foreground">
              "{data.problemDetails}"
            </p>
          )}
          {data.photo && (
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 text-[11px] font-bold text-muted-foreground">
                <ImageIcon className="h-3 w-3" /> Photo sent by customer
              </div>
              <img src={data.photo} alt="Problem" className="h-44 w-full object-cover" />
            </div>
          )}
        </div>

        {/* Customer + Contact options */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Customer</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary font-bold">{data.customerName.charAt(0)}</div>
            <div className="flex-1">
              <div className="font-bold">{data.customerName}</div>
              <div className="text-xs text-muted-foreground">{data.customerPhone}</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <ContactBtn icon={<Phone className="h-4 w-4" />} label="Call" tone="success" />
            <ContactBtn icon={<MessageCircle className="h-4 w-4" />} label="Chat" tone="primary" />
            <ContactBtn icon={<Video className="h-4 w-4" />} label="Video" tone="warning" />
          </div>
        </div>

        {/* Assign options */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Job Handler</div>
            {assigned && <button onClick={() => setAssigned(null)} className="text-xs font-bold text-primary">Change</button>}
          </div>

          {assigned ? (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary font-bold text-primary-foreground">
                {assigned.avatar}
              </div>
              <div className="flex-1">
                <div className="font-bold">{assigned.name}</div>
                <div className="text-xs text-success">{assigned.type === "partner" ? "Partner notified" : "Assigned • on the way"}</div>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {hasStaff && (
                <button onClick={() => setShowAssign(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary-soft py-3 text-sm font-bold text-primary">
                  <User className="h-4 w-4" /> Assign to Staff
                </button>
              )}
              <button
                onClick={() => setAssigned({ type: "partner", name: "Verma Tyre Works", avatar: "VT" })}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-card py-3 text-sm font-bold text-foreground"
              >
                <Briefcase className="h-4 w-4" /> Assign to Business Partner
              </button>
              <p className="text-center text-[11px] text-muted-foreground">Ya niche se direct Start Job dabao</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 border-t border-border bg-card/95 p-4 backdrop-blur safe-bottom">
        <Link to="/job/$id/navigate" params={{ id: data.id }} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated">
          <Navigation className="h-5 w-5" /> Start Job
        </Link>
      </div>

      {showAssign && (
        <AssignSheet
          onClose={() => setShowAssign(false)}
          onAssign={(s) => { setAssigned({ type: "staff", name: s.name, avatar: s.avatar }); setShowAssign(false); }}
        />
      )}
    </div>
  );
}

function ContactBtn({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: "success" | "primary" | "warning" }) {
  const cls = tone === "success"
    ? "bg-success/15 text-success border-success/30"
    : tone === "primary"
    ? "bg-primary-soft text-primary border-primary/30"
    : "bg-warning/15 text-warning border-warning/30";
  return (
    <button className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 text-xs font-bold ${cls}`}>
      {icon}<span>{label}</span>
    </button>
  );
}

function AssignSheet({ onClose, onAssign }: { onClose: () => void; onAssign: (s: { name: string; avatar: string }) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-foreground/40 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
        <h3 className="text-xl font-bold">Assign Staff</h3>
        <p className="text-xs text-muted-foreground">Select an available team member</p>
        <div className="mt-5 max-h-[60vh] space-y-2 overflow-y-auto">
          {staffList.filter(s => s.active).map((s) => (
            <button key={s.id} onClick={() => onAssign({ name: s.name, avatar: s.avatar })} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition active:scale-[0.99]">
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
