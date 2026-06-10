import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, ScreenHeader } from "@/components/MobileShell";
import { staffList } from "@/lib/mock-data";
import { Phone, MoreVertical, Plus } from "lucide-react";

export const Route = createFileRoute("/staff")({ component: StaffPage });

function StaffPage() {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const filtered = staffList.filter((s) => filter === "all" || (filter === "active" ? s.active : !s.active));

  return (
    <MobileShell>
      <ScreenHeader title="My Staff" right={
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated">
          <Plus className="h-5 w-5" />
        </button>
      } />
      <div className="bg-gradient-hero px-5 pb-6 pt-2 text-white">
        <div className="grid grid-cols-3 gap-3">
          <Stat val={staffList.length} label="Total" />
          <Stat val={staffList.filter(s => s.active).length} label="Active" />
          <Stat val={staffList.filter(s => !s.active).length} label="Offline" />
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
              <button className="text-muted-foreground"><MoreVertical className="h-5 w-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </MobileShell>
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
