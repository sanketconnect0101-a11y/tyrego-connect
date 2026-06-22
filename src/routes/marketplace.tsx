import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, ScreenHeader } from "@/components/MobileShell";
import { Search, ShoppingCart, Plus, Minus, X, Package, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/marketplace")({ component: Marketplace });

type Product = { id: string; name: string; brand: string; price: number; mrp: number; icon: string; category: string };

const PRODUCTS: Product[] = [
  { id: "p1", name: 'Tubeless Tyre 90/90-12', brand: "MRF", price: 1450, mrp: 1700, icon: "🛞", category: "Tyres" },
  { id: "p2", name: 'Tubeless Tyre 165/70 R14', brand: "Apollo", price: 3850, mrp: 4400, icon: "🛞", category: "Tyres" },
  { id: "p3", name: "Puncture Repair Kit", brand: "Bosch", price: 480, mrp: 650, icon: "🧰", category: "Tools" },
  { id: "p4", name: "Digital Tyre Inflator", brand: "Coido", price: 1899, mrp: 2499, icon: "💨", category: "Tools" },
  { id: "p5", name: "Engine Oil 1L (10W30)", brand: "Castrol", price: 540, mrp: 620, icon: "🛢️", category: "Oils" },
  { id: "p6", name: "Battery 35Ah", brand: "Exide", price: 4200, mrp: 4800, icon: "🔋", category: "Battery" },
  { id: "p7", name: "Valve Caps (Pack of 20)", brand: "Generic", price: 120, mrp: 200, icon: "🔩", category: "Parts" },
  { id: "p8", name: "Wheel Balancing Weights", brand: "Perfect", price: 350, mrp: 450, icon: "⚖️", category: "Parts" },
];

const CATS = ["All", "Tyres", "Tools", "Oils", "Battery", "Parts"];

function Marketplace() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [placed, setPlaced] = useState(false);

  const items = PRODUCTS.filter(p => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((s, [id, n]) => s + (PRODUCTS.find(p => p.id === id)?.price ?? 0) * n, 0);

  const add = (id: string) => setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const sub = (id: string) => setCart(c => { const n = (c[id] ?? 0) - 1; const x = { ...c }; if (n <= 0) delete x[id]; else x[id] = n; return x; });

  return (
    <MobileShell>
      <ScreenHeader title="Marketplace" right={
        <button onClick={() => setShowCart(true)} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground">{count}</span>}
        </button>
      } />

      <div className="bg-gradient-hero px-5 pb-6 pt-2 text-white">
        <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2.5 backdrop-blur">
          <Search className="h-4 w-4" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search tyres, tools, oils…" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/70 outline-none" />
        </div>
        <p className="mt-3 text-xs text-white/85">Order parts & tools • Delivered to your shop in 24–48 hrs</p>
      </div>

      <div className="sticky top-[68px] z-20 flex gap-2 overflow-x-auto bg-background/95 px-5 py-3 backdrop-blur">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition ${cat === c ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground"}`}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pb-6">
        {items.map(p => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="flex h-24 items-center justify-center bg-secondary text-5xl">{p.icon}</div>
            <div className="p-3">
              <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{p.brand}</div>
              <div className="mt-0.5 line-clamp-2 text-xs font-bold leading-snug">{p.name}</div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-sm font-extrabold text-primary">₹{p.price}</span>
                <span className="text-[10px] text-muted-foreground line-through">₹{p.mrp}</span>
              </div>
              {cart[p.id] ? (
                <div className="mt-2 flex items-center justify-between rounded-xl bg-primary-soft p-1">
                  <button onClick={() => sub(p.id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-card text-primary"><Minus className="h-3 w-3" /></button>
                  <span className="text-sm font-extrabold text-primary">{cart[p.id]}</span>
                  <button onClick={() => add(p.id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Plus className="h-3 w-3" /></button>
                </div>
              ) : (
                <button onClick={() => add(p.id)} className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl bg-gradient-primary py-2 text-xs font-bold text-primary-foreground"><Plus className="h-3 w-3" /> Add</button>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-2 rounded-2xl bg-secondary p-6 text-center text-sm text-muted-foreground">No products found</div>}
      </div>

      {count > 0 && !showCart && (
        <button onClick={() => setShowCart(true)} className="fixed inset-x-0 bottom-24 z-30 mx-auto flex w-[92%] max-w-md items-center justify-between rounded-2xl bg-gradient-primary px-4 py-3 text-primary-foreground shadow-elevated">
          <div className="flex items-center gap-2 text-sm font-bold"><ShoppingCart className="h-4 w-4" /> {count} item{count > 1 ? "s" : ""} • ₹{total}</div>
          <div className="text-xs font-extrabold">View Cart →</div>
        </button>
      )}

      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/50 backdrop-blur-sm" onClick={() => setShowCart(false)}>
          <div onClick={e => e.stopPropagation()} className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet safe-bottom">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
            {placed ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success"><CheckCircle2 className="h-9 w-9" /></div>
                <h3 className="mt-4 text-xl font-extrabold">Order Placed!</h3>
                <p className="mt-1 text-sm text-muted-foreground">Delivery in 24–48 hrs to your shop</p>
                <button onClick={() => { setPlaced(false); setShowCart(false); setCart({}); }} className="mt-5 w-full rounded-2xl bg-gradient-primary py-3.5 font-bold text-primary-foreground">Done</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold">Your Cart</h3>
                  <button onClick={() => setShowCart(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
                </div>
                <div className="mt-4 max-h-[40vh] space-y-2 overflow-y-auto">
                  {Object.entries(cart).map(([id, n]) => {
                    const p = PRODUCTS.find(x => x.id === id)!;
                    return (
                      <div key={id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-xl">{p.icon}</div>
                        <div className="flex-1 text-xs font-bold">{p.name}<div className="text-[10px] font-medium text-muted-foreground">₹{p.price} × {n}</div></div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => sub(id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary"><Minus className="h-3 w-3" /></button>
                          <span className="w-5 text-center text-sm font-bold">{n}</span>
                          <button onClick={() => add(id)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Plus className="h-3 w-3" /></button>
                        </div>
                      </div>
                    );
                  })}
                  {count === 0 && <div className="rounded-2xl bg-secondary p-6 text-center text-sm text-muted-foreground"><Package className="mx-auto mb-2 h-6 w-6" />Cart is empty</div>}
                </div>
                {count > 0 && (
                  <>
                    <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary-soft p-3">
                      <span className="text-sm font-bold text-primary">Total</span>
                      <span className="text-lg font-extrabold text-primary">₹{total}</span>
                    </div>
                    <button onClick={() => setPlaced(true)} className="mt-3 w-full rounded-2xl bg-gradient-primary py-3.5 font-bold text-primary-foreground shadow-elevated">Place Order • ₹{total}</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </MobileShell>
  );
}
