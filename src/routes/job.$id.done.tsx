import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/job/$id/done")({ component: Done });

function Done() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-16 w-16" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="mt-8 text-3xl font-extrabold">Job Completed! 🎉</h1>
        <p className="mt-2 text-sm text-muted-foreground">Great work, Sharma Auto Works</p>

        <div className="mt-8 w-full rounded-3xl border border-border bg-card p-5 text-left shadow-card">
          <Row label="Vehicle" value="🚗 Car" />
          <Row label="Service" value="Puncture Repair" />
          <Row label="Amount" value="₹250" highlight />
          <Row label="Staff" value="Ramesh Yadav" />
          <Row label="Time Taken" value="38 min" />
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-xs font-bold text-primary">
          ⭐ Customer left a 5-star rating
        </div>
      </div>

      <div className="space-y-3 p-5 safe-bottom">
        <Link to="/home" className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated">
          Back to Home
        </Link>
        <Link to="/jobs" className="block text-center text-sm font-semibold text-muted-foreground">View All Jobs</Link>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${highlight ? "text-primary text-base" : ""}`}>{value}</span>
    </div>
  );
}
