import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { ChevronRight, Store, Truck, Wrench, Clock, MapPin, LogOut, Star, Settings, HelpCircle, Plus, X, Trash2, Users } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

type Service = { id: string; name: string; price: number; icon: string };

const DEFAULTS: Service[] = [
  { id: "puncture", name: "Puncture Repair", price: 100, icon: "🔧" },
  { id: "air", name: "Air Filling", price: 30, icon: "💨" },
  { id: "replace", name: "Tyre Replacement", price: 500, icon: "🛞" },
];

const KEY = "autoxpert_services";

function Profile() {
  const [services, setServices] = useState<Service[]>(DEFAULTS);
  const [showInv, setShowInv] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setServices(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Service[]) => {
    setServices(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  return (
    <MobileShell>
      <div className="bg-gradient-hero px-5 pb-16 pt-12 text-white safe-top">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">🏪</div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-extrabold">Sharma Auto Works</div>
            <div className="text-sm text-white/80">Rakesh Sharma • Owner</div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-bold">4.8</span>
              <span className="text-white/70">• 247 jobs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-10 space-y-3 px-5">
        <Row icon={<Store className="h-5 w-5" />} label="Shop Information" value="Andheri East, Mumbai" />
        <Row icon={<Truck className="h-5 w-5" />} label="Vehicle Types" value="Bike, Car, SUV, Auto" />
        <button onClick={() => setShowInv(true)} className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Wrench className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold">Services Inventory</div>
            <div className="truncate text-xs text-muted-foreground">{services.map(s => s.name).join(", ") || "Tap to add"}</div>
          </div>
          <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">{services.length}</span>
        </button>
        <Row icon={<Clock className="h-5 w-5" />} label="Working Hours" value="9:00 AM – 9:00 PM" />
        <Row icon={<MapPin className="h-5 w-5" />} label="Service Radius" value="10 km" />
      </div>

      <div class
Name="mt-6 space-y-3 px-5">
        <Link to="/staff" className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Users className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold">Manage Staff</div>
            <div className="truncate text-xs text-muted-foreground">Add or remove team members</div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <Row icon={<Settings className="h-5 w-5" />} label="Settings" />
        <Row icon={<HelpCircle className="h-5 w-5" />} label="Help & Support" />
      </div>

      <div className="mt-6 px-5 pb-6">
        <Link to="/" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-4 font-bold text-destructive">
          <LogOut className="h-4 w-4" /> Logout
        </Link>
        <div className="mt-4 text-center text-[11px] text-muted-foreground">AutoXpert Merchant v1.0.0</div>
      </div>

      {showInv && (
        <InventorySheet services={services} onSave={persist} onClose={() => setShowInv(false)} />
      )}
    </MobileShell>
  );
}

function InventorySheet({ services, onSave, onClose }: { services: Service[]; onSave: (s: Service[]) => void; onClose: () => void }) {
  const [list, setList] = useState<Service[]>(services);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const add = () => {
    const p = parseInt(price, 10);
    if (!name.trim() || isNaN(p)) return;
    setList((arr) => [...arr, { id: "S" + Date.now(), name: name.trim(), price: p, icon: "🛠️" }]);
    setName(""); setPrice("");
  };
  const remove = (id: string) => setList((arr) => arr.filter(s => s.id !== id));
  const updatePrice = (id: string, p: number) => setList((arr) => arr.map(s => s.id === id ? { ...s, price: p } : s));

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-foreground/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet safe-bottom">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold">Services Inventory</h3>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">Set your own prices for each service</p>

        <div className="mt-4 max-h-[40vh] space-y-2 overflow-y-auto">
          {list.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-xl">{s.icon}</div>
              <div className="flex-1 text-sm font-bold">{s.name}</div>
              <div className="flex items-center gap-1 rounded-xl border border-border bg-background px-2 py-1.5">
                <span className="text-xs font-bold text-muted-foreground">₹</span>
                <input
                  inputMode="numeric"
                  value={s.price}
                  onChange={(e) => updatePrice(s.id, parseInt(e.target.value || "0", 10))}
                  className="w-16 bg-transparent text-sm font-bold outline-none"
                />
              </div>
              <button onClick={() => remove(s.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border-2 border-dashed border-border p-3">
          <div className="text-xs font-bold uppercase text-muted-foreground">Add new service</div>
          <div className="mt-2 flex gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} placeholder="₹" className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <button onClick={add} className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></button>
          </div>
        </div>

        <button onClick={() => { onSave(list); onClose(); }} className="mt-4 w-full rounded-2xl bg-gradient-primary py-3.5 font-bold text-primary-foreground shadow-elevated">
          Save Inventory
        </button>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <button className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold">{label}</div>
        {value && <div className="truncate text-xs text-muted-foreground">{value}</div>}
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}
