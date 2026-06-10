import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { Stepper } from "./onboarding.shop";
import { vehicleTypes } from "@/lib/mock-data";
import { Check } from "lucide-react";

export const Route = createFileRoute("/onboarding/vehicles")({ component: Vehicles });

function Vehicles() {
  const [sel, setSel] = useState<Set<string>>(new Set(["bike", "car", "auto"]));
  const toggle = (id: string) => {
    const n = new Set(sel);
    n.has(id) ? n.delete(id) : n.add(id);
    setSel(n);
  };
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Vehicle Types" />
      <Stepper step={2} />
      <div className="px-5 pb-2">
        <h2 className="text-xl font-bold">What can you service?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Select all vehicle types you handle</p>
      </div>
      <div className="flex-1 px-5 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {vehicleTypes.map((v) => {
            const active = sel.has(v.id);
            return (
              <button
                key={v.id}
                onClick={() => toggle(v.id)}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition ${active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}
              >
                {active && (
                  <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </div>
                )}
                <div className="text-4xl">{v.icon}</div>
                <div className={`text-sm font-bold ${active ? "text-primary" : "text-foreground"}`}>{v.label}</div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur-lg safe-bottom">
        <div className="mb-3 text-center text-xs font-medium text-muted-foreground">{sel.size} selected</div>
        <Link to="/onboarding/services" className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated">
          Continue →
        </Link>
      </div>
    </div>
  );
}
