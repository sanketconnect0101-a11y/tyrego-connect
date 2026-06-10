import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";

export const Route = createFileRoute("/onboarding/shop")({ component: Shop });

const RADII = [5, 10, 15, 20];

function Shop() {
  const [radius, setRadius] = useState(10);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Shop Details" />
      <Stepper step={1} />

      <div className="flex-1 space-y-5 px-5 pt-2">
        <div className="rounded-2xl bg-primary-soft p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏪</div>
            <div>
              <div className="font-bold">Setup your shop</div>
              <div className="text-xs text-muted-foreground">Customers will see this info</div>
            </div>
          </div>
        </div>

        <Field label="Owner Name" placeholder="Rakesh Sharma" />
        <Field label="Shop Name" placeholder="Sharma Tyre Works" />
        <Field label="Full Address" placeholder="Shop 12, MG Road, Andheri East" textarea />
        <Field label="Working Hours" placeholder="9:00 AM – 9:00 PM" />

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service Radius</label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {RADII.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`rounded-2xl border-2 py-4 text-center font-bold transition ${radius === r ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-foreground"}`}
              >
                <div className="text-lg">{r}</div>
                <div className="text-[10px] font-medium opacity-70">KM</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur-lg safe-bottom">
        <Link to="/onboarding/vehicles" className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated">
          Continue →
        </Link>
      </div>
    </div>
  );
}

function Field({ label, placeholder, textarea }: { label: string; placeholder: string; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea rows={2} placeholder={placeholder} className="mt-2 w-full resize-none rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-medium outline-none focus:border-primary" />
      ) : (
        <input placeholder={placeholder} className="mt-2 w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-medium outline-none focus:border-primary" />
      )}
    </div>
  );
}

export function Stepper({ step }: { step: number }) {
  const total = 4;
  return (
    <div className="flex items-center gap-2 px-5 pb-4 pt-1">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition ${i < step ? "bg-primary" : "bg-border"}`} />
      ))}
      <span className="ml-2 text-[11px] font-bold text-muted-foreground">{step}/{total}</span>
    </div>
  );
}
