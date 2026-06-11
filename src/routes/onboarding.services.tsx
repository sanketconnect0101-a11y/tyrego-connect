import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { Stepper } from "./onboarding.shop";
import { serviceTypes } from "@/lib/mock-data";
import { Check } from "lucide-react";

export const Route = createFileRoute("/onboarding/services")({ component: Services });

function Services() {
  const [sel, setSel] = useState<Set<string>>(new Set(["puncture", "air", "replace"]));
  const toggle = (id: string) => {
    const n = new Set(sel);
    n.has(id) ? n.delete(id) : n.add(id);
    setSel(n);
  };
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Services Offered" />
      <Stepper step={4} />
      <div className="px-5 pb-2">
        <h2 className="text-xl font-bold">What services do you offer?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Customers will book these from your shop</p>
      </div>
      <div className="flex-1 space-y-3 px-5 pt-4">
        {serviceTypes.map((s) => {
          const active = sel.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-3xl shadow-card">{s.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-bold">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                {active && <Check className="h-4 w-4" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>
      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur-lg safe-bottom">
        <Link to="/home" className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated">
          Finish Setup →
        </Link>
      </div>
    </div>
  );
}
