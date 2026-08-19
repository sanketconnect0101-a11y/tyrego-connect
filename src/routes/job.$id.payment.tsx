import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { eligibleOffers, type Offer } from "@/lib/mock-data";
import { Banknote, Smartphone, CreditCard, Check, IndianRupee, Tag, Zap, Ticket, X, Loader2, Percent } from "lucide-react";

export const Route = createFileRoute("/job/$id/payment")({ component: Payment });

const METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, desc: "Collect in person" },
  { id: "upi", label: "UPI", icon: Smartphone, desc: "GPay / PhonePe" },
  { id: "card", label: "Card", icon: CreditCard, desc: "Debit / Credit" },
];

function calcDiscount(o: Offer, order: number) {
  if (order < o.minOrder) return 0;
  const raw = o.discountType === "flat" ? o.value : (order * o.value) / 100;
  return Math.floor(Math.min(raw, o.maxDiscount ?? raw));
}

function Payment() {
  const { id } = Route.useParams();
  const [method, setMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("250");
  const [collecting, setCollecting] = useState(false);
  const [done, setDone] = useState(false);

  const order = parseInt(amount || "0", 10) || 0;

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  // Fetch eligible offers (API)
  useEffect(() => {
    let alive = true;
    setLoadingOffers(true);
    const t = setTimeout(() => {
      if (!alive) return;
      setOffers(eligibleOffers);
      setLoadingOffers(false);
      const auto = eligibleOffers.find((o) => o.type === "auto");
      if (auto) setAppliedId(auto.id);
    }, 900);
    return () => { alive = false; clearTimeout(t); };
  }, []);

  // Merchant instant discount
  const [manualMode, setManualMode] = useState<"flat" | "percent">("flat");
  const [manualValue, setManualValue] = useState("");
  const [manualOn, setManualOn] = useState(false);

  const applied = offers.find((o) => o.id === appliedId) ?? null;
  const offerDiscount = useMemo(() => (applied ? calcDiscount(applied, order) : 0), [applied, order]);

  const manualDiscount = useMemo(() => {
    if (!manualOn) return 0;
    const v = parseInt(manualValue || "0", 10) || 0;
    const raw = manualMode === "flat" ? v : (order * Math.min(v, 100)) / 100;
    return Math.max(Math.min(Math.floor(raw), Math.max(order - offerDiscount, 0)), 0);
  }, [manualOn, manualValue, manualMode, order, offerDiscount]);

  const discount = offerDiscount + manualDiscount;
  const payable = Math.max(order - discount, 0);

  // Drop offer if it becomes ineligible after amount edit
  useEffect(() => {
    if (applied && order < applied.minOrder) setAppliedId(null);
  }, [order, applied]);

  const applyCode = () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    const found = offers.find((o) => o.code.toUpperCase() === code);
    if (!found) return setCodeError("Invalid coupon code");
    if (calcDiscount(found, order) <= 0) return setCodeError(`Min order ₹${found.minOrder} required`);
    setAppliedId(found.id);
    setCodeError(null);
    setCodeInput("");
    setShowOffers(false);
  };

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
          {discount > 0 && (
            <div className="mt-3 space-y-1 rounded-2xl bg-white/15 p-3 text-xs">
              <div className="flex justify-between"><span className="text-white/80">Order Amount</span><span className="font-bold">₹{order}</span></div>
              {offerDiscount > 0 && <div className="flex justify-between"><span className="text-white/80">Offer ({applied?.code})</span><span className="font-bold">− ₹{offerDiscount}</span></div>}
              {manualDiscount > 0 && <div className="flex justify-between"><span className="text-white/80">Instant Discount{manualMode === "percent" ? ` (${manualValue}%)` : ""}</span><span className="font-bold">− ₹{manualDiscount}</span></div>}
              <div className="flex justify-between border-t border-white/25 pt-1 text-sm"><span className="font-bold">Final Payable</span><span className="font-extrabold">₹{payable}</span></div>
            </div>
          )}
        </div>

        {/* Offers */}
        <div>
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Eligible Offers</div>
            {offers.length > 0 && (
              <button onClick={() => setShowOffers(true)} className="text-xs font-bold text-primary">
                View all ({offers.length})
              </button>
            )}
          </div>

          {loadingOffers ? (
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Fetching offers…
            </div>
          ) : applied ? (
            <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-success/40 bg-success/10 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success text-success-foreground">
                <Tag className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{applied.title}</div>
                <div className="text-[11px] text-muted-foreground">
                  {applied.code} • ₹{discount} saved {applied.type === "auto" ? "(auto applied)" : ""}
                </div>
              </div>
              <button onClick={() => setAppliedId(null)} className="rounded-lg bg-card p-1.5 text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowOffers(true)}
              className="mt-3 flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft p-4 text-left"
            >
              <Ticket className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="text-sm font-bold text-primary">Apply Coupon</div>
                <div className="text-[11px] text-muted-foreground">{offers.length} offers available for this job</div>
              </div>
            </button>
          )}

          {/* Manual code entry */}
          {!applied && !loadingOffers && (
            <div className="mt-2">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2">
                <Ticket className="ml-1 h-4 w-4 text-muted-foreground" />
                <input
                  value={codeInput}
                  onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setCodeError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && applyCode()}
                  placeholder="Enter coupon code"
                  className="min-w-0 flex-1 bg-transparent text-sm font-bold uppercase tracking-wider outline-none placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground"
                />
                <button
                  onClick={applyCode}
                  disabled={!codeInput.trim()}
                  className="rounded-xl bg-gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
              {codeError && <div className="mt-1 px-1 text-[11px] font-bold text-destructive">{codeError}</div>}
            </div>
          )}
        </div>

        {/* Merchant instant discount */}
        <div>
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Instant Discount (by you)</div>
            <button
              onClick={() => { setManualOn(!manualOn); if (manualOn) setManualValue(""); }}
              className={`rounded-full px-3 py-1 text-[11px] font-bold ${manualOn ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              {manualOn ? "ON" : "OFF"}
            </button>
          </div>

          {!manualOn ? (
            <button
              onClick={() => setManualOn(true)}
              className="mt-3 flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-warning/50 bg-warning/10 p-4 text-left"
            >
              <Percent className="h-5 w-5 text-warning" />
              <div className="flex-1">
                <div className="text-sm font-bold">Give Instant Discount</div>
                <div className="text-[11px] text-muted-foreground">Coupon na ho to khud se ₹ ya % chhoot dein</div>
              </div>
            </button>
          ) : (
            <div className="mt-3 space-y-3 rounded-2xl border border-border bg-card p-3">
              <div className="flex rounded-xl bg-secondary p-1">
                {(["flat", "percent"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setManualMode(m)}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold ${manualMode === m ? "bg-card shadow-sm" : "text-muted-foreground"}`}
                  >
                    {m === "flat" ? "₹ Amount" : "% Percent"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border px-3">
                <span className="text-sm font-bold text-muted-foreground">{manualMode === "flat" ? "₹" : "%"}</span>
                <input
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value.replace(/\D/g, "").slice(0, manualMode === "percent" ? 3 : 6))}
                  inputMode="numeric"
                  placeholder="0"
                  className="min-w-0 flex-1 bg-transparent py-3 text-lg font-extrabold outline-none"
                />
                {manualValue && (
                  <span className="text-xs font-bold text-success">− ₹{manualDiscount}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(manualMode === "flat" ? [20, 50, 100] : [5, 10, 20]).map((q) => (
                  <button
                    key={q}
                    onClick={() => setManualValue(String(q))}
                    className="rounded-lg bg-primary-soft px-3 py-1.5 text-[11px] font-bold text-primary"
                  >
                    {manualMode === "flat" ? `₹${q}` : `${q}%`}
                  </button>
                ))}
                <button
                  onClick={() => { setManualOn(false); setManualValue(""); }}
                  className="ml-auto rounded-lg bg-secondary px-3 py-1.5 text-[11px] font-bold text-muted-foreground"
                >
                  Remove
                </button>
              </div>
              {manualMode === "percent" && parseInt(manualValue || "0", 10) > 100 && (
                <div className="text-[11px] font-bold text-destructive">Max 100%</div>
              )}
            </div>
          )}
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
          {method ? `Collect ₹${payable} via ${METHODS.find(m => m.id === method)?.label}` : "Select a method"}
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
                ₹{payable} collected via {METHODS.find(m => m.id === method)?.label}
              </p>
              <div className="mt-5 w-full rounded-2xl bg-primary-soft p-4 text-left">
                <Row label="Order Amount" value={`₹${order}`} />
                {discount > 0 && <Row label={`Discount (${applied?.code})`} value={`− ₹${discount}`} />}
                <Row label="Final Payable" value={`₹${payable}`} />
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

      {/* Offers sheet */}
      {showOffers && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/40 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Eligible Offers</h3>
                <p className="text-xs text-muted-foreground">Order amount ₹{order}</p>
              </div>
              <button onClick={() => setShowOffers(false)} className="rounded-xl bg-secondary p-2"><X className="h-4 w-4" /></button>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft p-2">
                <Ticket className="ml-1 h-4 w-4 text-primary" />
                <input
                  value={codeInput}
                  onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setCodeError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && applyCode()}
                  placeholder="Have a code? Enter here"
                  className="min-w-0 flex-1 bg-transparent text-sm font-bold uppercase tracking-wider outline-none placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground"
                />
                <button
                  onClick={applyCode}
                  disabled={!codeInput.trim()}
                  className="rounded-xl bg-gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
              {codeError && <div className="mt-1 px-1 text-[11px] font-bold text-destructive">{codeError}</div>}
            </div>

            <div className="mt-3 max-h-[50vh] space-y-2 overflow-y-auto">
              {offers.map((o) => {
                const d = calcDiscount(o, order);
                const eligible = d > 0;
                const isApplied = appliedId === o.id;
                return (
                  <div
                    key={o.id}
                    className={`rounded-2xl border-2 p-3 ${isApplied ? "border-success bg-success/10" : eligible ? "border-border bg-card" : "border-border bg-secondary/50 opacity-60"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${o.type === "auto" ? "bg-warning/20 text-warning" : "bg-primary-soft text-primary"}`}>
                        {o.type === "auto" ? <Zap className="h-5 w-5" /> : <Ticket className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{o.title}</span>
                          <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${o.type === "auto" ? "bg-warning/20 text-warning" : "bg-primary-soft text-primary"}`}>
                            {o.type === "auto" ? "Auto Apply" : "Coupon"}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">{o.desc}</div>
                        <div className="mt-1 inline-block rounded-md border border-dashed border-primary/40 px-2 py-0.5 text-[11px] font-bold tracking-wider text-primary">
                          {o.code}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1 rounded-xl bg-secondary p-2.5 text-[11px]">
                      <div className="flex justify-between"><span className="text-muted-foreground">Order Amount</span><span className="font-bold">₹{order}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-bold text-success">− ₹{d}</span></div>
                      <div className="flex justify-between border-t border-border pt-1"><span className="text-muted-foreground">Final Payable</span><span className="font-extrabold">₹{Math.max(order - d, 0)}</span></div>
                    </div>

                    <button
                      disabled={!eligible}
                      onClick={() => { setAppliedId(isApplied ? null : o.id); if (!isApplied) setShowOffers(false); }}
                      className={`mt-2 w-full rounded-xl py-2.5 text-xs font-bold disabled:opacity-50 ${isApplied ? "bg-secondary text-foreground" : "bg-gradient-primary text-primary-foreground"}`}
                    >
                      {!eligible ? `Min order ₹${o.minOrder}` : isApplied ? "Remove" : "Apply Offer"}
                    </button>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setShowOffers(false)} className="mt-4 w-full rounded-2xl border border-border py-3 font-bold text-muted-foreground safe-bottom">Close</button>
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
