import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { Stepper } from "./onboarding.shop";
import { staffList } from "@/lib/mock-data";
import { Plus, Phone } from "lucide-react";

export const Route = createFileRoute("/onboarding/staff")({ component: StaffSetup });

function StaffSetup() {
  const [showSheet, setShowSheet] = useState(false);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Add Your Staff" />
      <Stepper step={4} />
      <div className="px-5 pb-2">
        <h2 className="text-xl font-bold">Build your team</h2>
        <p className="mt-1 text-sm text-muted-foreground">Add staff who will handle jobs</p>
      </div>

      <div className="flex-1 space-y-3 px-5 pt-4">
        {staffList.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary font-bold text-primary-foreground">{s.avatar}</div>
            <div className="min-w-0 flex-1">
              <div className="font-bold">{s.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {s.phone}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {s.vehicles.map((v) => <span key={v} className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">{v}</span>)}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowSheet(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft py-5 font-bold text-primary"
        >
          <Plus className="h-5 w-5" /> Add Staff Member
        </button>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur-lg safe-bottom">
        <Link to="/home" className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated">
          Finish Setup →
        </Link>
        <Link to="/home" className="mt-2 block text-center text-xs font-semibold text-muted-foreground">Skip for now</Link>
      </div>

      {showSheet && <AddStaffSheet onClose={() => setShowSheet(false)} />}
    </div>
  );
}

function AddStaffSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
        <h3 className="text-xl font-bold">Add Staff Member</h3>
        <div className="mt-5 space-y-3">
          <input placeholder="Full Name" className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 font-medium outline-none focus:border-primary" />
          <input placeholder="Mobile Number" className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 font-medium outline-none focus:border-primary" />
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vehicle types they handle</div>
          <div className="flex flex-wrap gap-2">
            {["Bike", "Car", "SUV", "Auto", "Truck"].map(v => (
              <button key={v} className="rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-semibold">{v}</button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 safe-bottom">
          <button onClick={onClose} className="rounded-2xl border border-border py-3.5 font-bold text-muted-foreground">Cancel</button>
          <button onClick={onClose} className="rounded-2xl bg-gradient-primary py-3.5 font-bold text-primary-foreground shadow-elevated">Add Staff</button>
        </div>
      </div>
    </div>
  );
}
