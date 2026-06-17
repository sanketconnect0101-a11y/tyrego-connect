import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell, ScreenHeader } from "@/components/MobileShell";
import { staffList as seedStaff, type Staff } from "@/lib/mock-data";
import { Phone, MoreVertical, Plus, X } from "lucide-react";

export const Route = createFileRoute("/staff")({ component: StaffPage });

const KEY = "autoxpert_staff";

function loadStaff(): Staff[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seedStaff;
}

function StaffPage() {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [staff, setStaff] = useState<Staff[]>(seedStaff);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { setStaff(loadStaff()); }, []);

  const persist = (next: Staff[]) => {
    setStaff(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      localStorage.setItem("autoxpert_staff_count", String(next.length));
    } catch {}
  };

  const filtered = staff.filter((s) => filter === "all" || (filter === "active" ? s.active : !s.active));

  return (
    <MobileShell>
      <ScreenHeader title="My Staff" right={
        <button onClick={() => setShowAdd(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated">
          <Plus className="h-5 w-5" />
        </button>
      } />
      <div className="bg-gradient-hero px-5 pb-6 pt-2 text-white">
        <div className="grid grid-cols-3 gap-3">
          <Stat val={staff.length} label="Total" />
          <Stat val={staff.filter(s => s.active).length} label="Active" />
          <Stat val={staff.filter(s => !s.active).length} label="Offline" />
        </div>
      </div>

      <div className="sticky top-[68px] z-20 flex gap-2 bg-background/95 px-5 py-3 backdrop-blur">
        {(["all", "active", "inactive"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-5 pb-6">
        {filtered.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-lg font-bold text-primary-foreground">{s.avatar}</div>
                <div className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card ${s.active ? "bg-success" : "bg-muted-foreground"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-bold">{s.name}</div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                    {s.active ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {s.phone}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.vehicles.map(v => <span key={v} className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">{v}</span>)}
                </div>
              </div>
              <button onClick={() => persist(staff.filter(x => x.id !== s.id))} className="text-muted-foreground" aria-label="Remove">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-secondary p-6 text-center text-sm text-muted-foreground">
            No staff yet. Tap + to add.
          </div>
        )}
      </div>

      {showAdd && (
        <AddStaffSheet
          onClose={() => setShowAdd(false)}
          onAdd={(s) => { persist([...staff, s]); setShowAdd(false); }}
        />
      )}
    </MobileShell>
  );
}

function AddStaffSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Staff) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicles, setVehicles] = useState<string[]>([]);
  const allVehicles = ["Bike", "Auto", "Car", "SUV", "Truck", "Bus"];

  const toggle = (v: string) => setVehicles((arr) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  const valid = name.trim().length > 1 && phone.length >= 10;

  const submit = () => {
    if (!valid) return;
    const initials = name.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();
    onAdd({
      id: "S" + Date.now(),
      name: name.trim(),
      phone: "+91 " + phone,
      vehicles: vehicles.length ? vehicles : ["Bike"],
      active: true,
      distanceKm: 0.5,
      avatar: initials || "ST",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-foreground/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet safe-bottom">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold">Add Staff</h3>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
        </div>

        <label className="mt-4 block text-xs font-bold uppercase text-muted-foreground">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ramesh Yadav" className="mt-1 w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-semibold outline-none focus:border-primary" />

        <label className="mt-3 block text-xs font-bold uppercase text-muted-foreground">Mobile</label>
        <div className="mt-1 flex items-center gap-2 rounded-2xl border-2 border-border bg-background px-4 py-3 focus-within:border-primary">
          <span className="font-semibold">🇮🇳 +91</span>
          <input
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="98xxx xxxxx"
            className="flex-1 bg-transparent font-semibold outline-none"
          />
        </div>

        <label className="mt-3 block text-xs font-bold uppercase text-muted-foreground">Vehicles handled</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {allVehicles.map(v => (
            <button key={v} onClick={() => toggle(v)} className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition ${vehicles.includes(v) ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground"}`}>
              {v}
            </button>
          ))}
        </div>

        <button onClick={submit} disabled={!valid} className="mt-5 w-full rounded-2xl bg-gradient-primary py-3.5 font-bold text-primary-foreground shadow-elevated disabled:opacity-40">
          Add Staff
        </button>
      </div>
    </div>
  );
}

function Stat({ val, label }: { val: number; label: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
      <div className="text-2xl font-extrabold">{val}</div>
      <div className="text-[10px] font-medium text-white/80">{label}</div>
    </div>
  );
}
