import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { Banknote, Smartphone, CreditCard, Check } from "lucide-react";

export const Route = createFileRoute("/job/$id/payment")({ component: Payment });

const METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, color: "text-success" },
  { id: "upi", label: "UPI", icon: Smartphone, color: "text-primary" },
  { id: "card", label: "Card", icon: CreditCard, color: "text-warning-foreground" },
];

function Payment() {
  const { id } = Route.useParams();
  const [method, setMethod] = useState("cash");
  const [status, setStatus] = useState<"paid" | "pending">("paid");
  const [amount, setAmount] = useState("250");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Payment" back />
      <div className="space-y-5 p-5">
        <div className="rounded-2xl bg-gradient-primary p-6 text-primary-foreground shadow-elevated">
          <div className="text-xs font-bold uppercase tracking-wider text-white/80">Total Amount</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold">₹</span>
            <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} className="w-40 bg-transparent text-5xl font-extrabold outline-none" />
          </div>
          <div className="mt-2 text-xs text-white/70">Tap to edit • Includes service charge</div>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Payment Method</div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {METHODS.map((m) => {
              const Icon = m.icon;
              const active = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)} className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition ${active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                  <Icon className={`h-6 w-6 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-bold ${active ? "text-primary" : "text-foreground"}`}>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Payment Status</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button onClick={() => setStatus("paid")} className={`flex items-center justify-center gap-2 rounded-2xl border-2 py-4 font-bold transition ${status === "paid" ? "border-success bg-success/10 text-success" : "border-border bg-card text-muted-foreground"}`}>
              <Check className="h-4 w-4" strokeWidth={3} /> Paid
            </button>
            <button onClick={() => setStatus("pending")} className={`rounded-2xl border-2 py-4 font-bold transition ${status === "pending" ? "border-warning bg-warning/10 text-warning-foreground" : "border-border bg-card text-muted-foreground"}`}>
              Pending
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-primary-soft p-3 text-xs text-muted-foreground">
          💡 This is for record-keeping only. No payment gateway is involved.
        </div>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur safe-bottom">
        <Link to="/job/$id/done" params={{ id }} className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated">
          Save Payment & Complete
        </Link>
      </div>
    </div>
  );
}
