import { createFileRoute, Link } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/MobileShell";
import { recentJobs } from "@/lib/mock-data";
import { CheckCircle2, IndianRupee, Phone, Download, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/job/$id/summary")({
  head: () => ({
    meta: [
      { title: "Completed Job Summary — AutoXpert" },
      { name: "description", content: "View the full summary, payment and rating of a completed AutoXpert job." },
      { property: "og:title", content: "Completed Job Summary — AutoXpert" },
      { property: "og:description", content: "View the full summary, payment and rating of a completed AutoXpert job." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Summary,
});

function Summary() {
  const { id } = Route.useParams();
  const job = recentJobs.find((j) => j.id === id);

  if (!job) return <div className="p-10 text-center">Job not found</div>;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Completed Job" back />

      <div className="space-y-3 p-4">
        <div className="rounded-3xl border border-success/30 bg-success/10 p-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
            <CheckCircle2 className="h-9 w-9" strokeWidth={2.5} />
          </div>
          <div className="mt-3 text-lg font-extrabold text-success">Job Completed</div>
          <div className="text-xs text-muted-foreground">{job.id} • {job.time}</div>
          <div className="mt-3 flex items-center justify-center text-3xl font-extrabold">
            <IndianRupee className="h-6 w-6" />{job.amount}
          </div>
          <div className="mt-1 inline-flex rounded-full bg-success/20 px-3 py-1 text-[11px] font-bold text-success">Payment Received</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Job Details</div>
          <div className="mt-2">
            <Row label="Service" value={job.problem} />
            <Row label="Vehicle" value={job.vehicle} />
            <Row label="Staff" value={job.staff || "Self"} />
            <Row label="Completed" value={job.time} />
            <Row label="Payment Mode" value="Cash" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Customer</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary font-bold">{job.customer.charAt(0)}</div>
            <div className="flex-1">
              <div className="font-bold">{job.customer}</div>
              <div className="text-xs text-muted-foreground">+91 98xxx xxxxx</div>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
              <Phone className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <div className="space-y-3 p-4 safe-bottom">
        <button onClick={downloadInvoice} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-border py-3.5 font-bold">
          <Download className="h-4 w-4" /> Download Invoice
        </button>
        <Link to="/jobs" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated">
          <RotateCcw className="h-4 w-4" /> Back to Jobs
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
