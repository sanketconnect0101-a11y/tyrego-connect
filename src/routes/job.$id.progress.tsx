import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { Check } from "lucide-react";

export const Route = createFileRoute("/job/$id/progress")({ component: Progress });

const STEPS = ["Reached Customer", "Inspection", "Repairing", "Completed"];
const SERVICES = ["Puncture Fixed", "Tyre Replaced", "Air Filled", "Wheel Changed"];

function Progress() {
  const { id } = Route.useParams();
  const [step, setStep] = useState(2);
  const [services, setServices] = useState<Set<string>>(new Set(["Puncture Fixed"]));
  const [notes, setNotes] = useState("");

  const toggle = (s: string) => {
    const n = new Set(services);
    n.has(s) ? n.delete(s) : n.add(s);
    setServices(n);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Job In Progress" back />

      <div className="space-y-5 p-5">
        {/* Timeline */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Progress</div>
          <div className="mt-4 space-y-1">
            {STEPS.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <div key={s} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <button onClick={() => setStep(i + 1)} className={`flex h-8 w-8 items-center justify-center rounded-full transition ${done ? "bg-success text-success-foreground" : current ? "bg-primary text-primary-foreground animate-pulse-ring" : "bg-secondary text-muted-foreground"}`}>
                      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </button>
                    {i < STEPS.length - 1 && <div className={`my-1 h-8 w-0.5 ${done ? "bg-success" : "bg-border"}`} />}
                  </div>
                  <div className="flex-1 pb-4 pt-1">
                    <div className={`text-sm font-bold ${done ? "text-success" : current ? "text-primary" : "text-muted-foreground"}`}>{s}</div>
                    {current && <div className="text-xs text-muted-foreground">In progress now…</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services completed */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Service Completed</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {SERVICES.map((s) => {
              const active = services.has(s);
              return (
                <button key={s} onClick={() => toggle(s)} className={`flex items-center gap-2 rounded-xl border-2 p-3 text-left text-xs font-semibold transition ${active ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-foreground"}`}>
                  <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  </div>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any additional info for customer..." className="mt-2 w-full resize-none rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" />
        </div>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur safe-bottom">
        <Link to="/job/$id/payment" params={{ id }} className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated">
          Complete Job →
        </Link>
      </div>
    </div>
  );
}
