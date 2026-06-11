import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { Stepper } from "./onboarding.shop";
import { Plus, Phone, X, Trash2 } from "lucide-react";

export const Route = createFileRoute("/onboarding/staff")({ component: StaffSetup });

type LocalStaff = { id: string; name: string; phone: string };

function StaffSetup() {
  const [showSheet, setShowSheet] = useState(false);
  const [staff, setStaff] = useState<LocalStaff[]>([]);

  const addStaff = (s: LocalStaff) => {
    setStaff((prev) => [...prev, s]);
    try { localStorage.setItem("autoxpert_staff_count", String(staff.length + 1)); } catch {}
  };
  const removeStaff = (id: string) => {
    const next = staff.filter((s) => s.id !== id);
    setStaff(next);
    try { localStorage.setItem("autoxpert_staff_count", String(next.length)); } catch {}
  };

  const persistAndGo = () => {
    try { localStorage.setItem("autoxpert_staff_count", String(staff.length)); } catch {}
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Add Your Staff" />
      <Stepper step={3} />
      <div className="px-5 pb-2">
        <h2 className="text-xl font-bold">Team members (optional)</h2>
        <p className="mt-1 text-sm text-muted-foreground">Add 2–3 staff who handle jobs, or skip & handle yourself</p>
      </div>

      <div className="flex-1 space-y-3 px-5 pt-4">
        {staff.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary font-bold text-primary-foreground">
              {s.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold">{s.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {s.phone}</div>
            </div>
            <button onClick={() => removeStaff(s.id)} className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {staff.length < 5 && (
          <button
            onClick={() => setShowSheet(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft py-5 font-bold text-primary"
          >
            <Plus className="h-5 w-5" /> Add Staff Member
          </button>
        )}

        {staff.length === 0 && (
          <div className="rounded-2xl bg-secondary p-4 text-center text-xs text-muted-foreground">
            💡 No staff? No problem — you can handle leads yourself.
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur-lg safe-bottom">
        <Link onClick={persistAndGo} to="/onboarding/services" className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated">
          {staff.length > 0 ? "Continue →" : "Skip & Continue →"}
        </Link>
      </div>

      {showSheet && <AddStaffSheet onClose={() => setShowSheet(false)} onAdd={addStaff} />}
    </div>
  );
}

function AddStaffSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (s: LocalStaff) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const save = () => {
    if (name.length < 2 || phone.length < 10) return;
    onAdd({ id: `s_${Date.now()}`, name, phone });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Add Staff Member</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 font-medium outline-none focus:border-primary" />
          <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Mobile Number" inputMode="numeric" className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 font-medium outline-none focus:border-primary" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 safe-bottom">
          <button onClick={onClose} className="rounded-2xl border border-border py-3.5 font-bold text-muted-foreground">Cancel</button>
          <button onClick={save} disabled={name.length < 2 || phone.length < 10} className="rounded-2xl bg-gradient-primary py-3.5 font-bold text-primary-foreground shadow-elevated disabled:opacity-40">Add Staff</button>
        </div>
      </div>
    </div>
  );
}
