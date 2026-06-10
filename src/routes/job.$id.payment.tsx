import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { Banknote, Smartphone, CreditCard, Check, IndianRupee } from "lucide-react";

export const Route = createFileRoute("/job/$id/payment")({ component: Payment });

const METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, desc: "Collect in person" },
  { id: "upi", label: "UPI", icon: Smartphone, desc: "GPay / PhonePe" },
  { id: "card", label: "Card", icon: CreditCard, desc: "Debit / Credit" },
];

function Payment() {
  const { id } = Route.useParams();
  const [method, setMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("250");
  const [collecting, setCollecting] = useState(false);
  const [done, setDone] = useState(false);

  const startCollect = () => {
    if (!method) return;
    setCollecting(true);
    setTimeout(() => {
      setCollecting(false);
      setDone(true);
    }, 2200);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Collect Payment" back />

      <div className="space-y-5 p-5">
        {/* Amount */}
        <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-elevated">
          <div className="text-xs font-bold uppercase tracking-wider text-white/80">Amount to Collect</div>
          <div className="mt-1 flex items-baseline">
            <IndianRupee className="h-7 w-7" />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              className="w-40 bg-transparent text-5xl font-extrabold outline-none"
            />
          </div>
          <div className="mt-2 text-xs text-white/70">Tap amount to edit</div>
        </div>

        {/* Method */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Select Payment Method</div>
          <div className="mt-3 space-y-2">
            {METHODS.map((m) => {
              const Icon = m.icon;
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition active:scale-[0.99] ${active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground">{m.desc}</div>
                  </div>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`}>
                    {active && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-primary-soft p-3 text-xs text-muted-foreground">
          💡 Confirm cash received or payment shown on customer's device before marking complete.
        </div>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur safe-bottom">
        <button
          onClick={startCollect}
          disabled={!method}
          className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated disabled:opacity-50"
        >
          {method ? `Collect ₹${amount} via ${METHODS.find(m => m.id === method)?.label}` : "Select a method"}
        </button>
      </div>

      {/* Collecting overlay */}
      {collecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
          <div className="mx-5 w-full max-w-sm rounded-3xl bg-card p-8 text-center shadow-sheet">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30" />
              <span className="absolute inline-flex h-20 w-20 animate-pulse rounded-full bg-primary/20" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elevated">
                <IndianRupee className="h-8 w-8" />
              </div>
            </div>
            <h3 className="mt-5 text-lg font-extrabold">Collecting payment…</h3>
            <p className="mt-1 text-xs text-muted-foreground">Waiting for confirmation</p>
          </div>
        </div>
      )}

      {/* Success overlay */}
      {done && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-6 shadow-sheet">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-success text-success-foreground shadow-elevated">
                  <Check className="h-12 w-12" strokeWidth={3} />
                </div>
              </div>
              <h2 className="mt-5 text-2xl font-extrabold">Payment Received!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                ₹{amount} collected via {METHODS.find(m => m.id === method)?.label}
              </p>
              <div className="mt-5 w-full rounded-2xl bg-primary-soft p-4 text-left">
                <Row label="Amount" value={`₹${amount}`} />
                <Row label="Method" value={METHODS.find(m => m.id === method)?.label ?? ""} />
                <Row label="Status" value="✅ Successful" />
              </div>
              <Link
                to="/job/$id/done"
                params={{ id }}
                className="mt-5 flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated"
              >
                Complete Job →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-primary/10 py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
