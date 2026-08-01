import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { MobileShell } from "@/components/MobileShell";
import { ChevronRight, Store, Truck, Wrench, Clock, MapPin, LogOut, Star, Settings, HelpCircle, Plus, X, Trash2, Users, Camera, Phone, MessageCircle, Mail, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

type Service = { id: string; name: string; price: number; icon: string };

const DEFAULT_SERVICES: Service[] = [
  { id: "puncture", name: "Puncture Repair", price: 100, icon: "🔧" },
  { id: "air", name: "Air Filling", price: 30, icon: "💨" },
  { id: "replace", name: "Tyre Replacement", price: 500, icon: "🛞" },
];

type Shop = { name: string; owner: string; phone: string; address: string; photo: string | null };
type Hours = { open: string; close: string; days: string[] };

const DEFAULT_SHOP: Shop = {
  name: "Sharma Auto Works",
  owner: "Rakesh Sharma",
  phone: "+91 98765 43210",
  address: "Andheri East, Mumbai",
  photo: null,
};
const DEFAULT_VEHICLES = ["Bike", "Car", "SUV", "Auto"];
const ALL_VEHICLES = ["Bike", "Auto", "Car", "SUV", "Truck", "Bus", "Tempo", "Tractor"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_HOURS: Hours = { open: "09:00", close: "21:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] };
type Prefs = { notifications: boolean; sound: boolean; autoAccept: boolean; language: string };
const DEFAULT_PREFS: Prefs = { notifications: true, sound: true, autoAccept: false, language: "English" };

const K = {
  services: "autoxpert_services",
  shop: "autoxpert_shop",
  vehicles: "autoxpert_vehicles",
  hours: "autoxpert_hours",
  radius: "autoxpert_radius",
  prefs: "autoxpert_prefs",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}
function save<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

type SheetId = "services" | "shop" | "vehicles" | "hours" | "radius" | "settings" | "help" | null;

function Profile() {
  const [sheet, setSheet] = useState<SheetId>(null);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [shop, setShop] = useState<Shop>(DEFAULT_SHOP);
  const [vehicles, setVehicles] = useState<string[]>(DEFAULT_VEHICLES);
  const [hours, setHours] = useState<Hours>(DEFAULT_HOURS);
  const [radius, setRadius] = useState<number>(10);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  useEffect(() => {
    setServices(load(K.services, DEFAULT_SERVICES));
    setShop(load(K.shop, DEFAULT_SHOP));
    setVehicles(load(K.vehicles, DEFAULT_VEHICLES));
    setHours(load(K.hours, DEFAULT_HOURS));
    setRadius(load(K.radius, 10));
    setPrefs(load(K.prefs, DEFAULT_PREFS));
  }, []);

  const fmtTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ap = h >= 12 ? "PM" : "AM";
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
  };

  return (
    <MobileShell>
      <div className="bg-gradient-hero px-5 pb-16 pt-12 text-white safe-top">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/20 text-3xl backdrop-blur">
            {shop.photo ? <img src={shop.photo} alt="Shop" className="h-full w-full object-cover" /> : "🏪"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xl font-extrabold">{shop.name}</div>
            <div className="truncate text-sm text-white/80">{shop.owner} • Owner</div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-bold">4.8</span>
              <span className="text-white/70">• 247 jobs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-10 space-y-3 px-5">
        <Row icon={<Store className="h-5 w-5" />} label="Shop Information" value={shop.address} onClick={() => setSheet("shop")} />
        <Row icon={<Truck className="h-5 w-5" />} label="Vehicle Types" value={vehicles.join(", ") || "None selected"} onClick={() => setSheet("vehicles")} />
        <Row
          icon={<Wrench className="h-5 w-5" />}
          label="Services Inventory"
          value={services.map((s) => s.name).join(", ") || "Tap to add"}
          onClick={() => setSheet("services")}
          badge={services.length}
        />
        <Row icon={<Clock className="h-5 w-5" />} label="Working Hours" value={`${fmtTime(hours.open)} – ${fmtTime(hours.close)} • ${hours.days.length} days`} onClick={() => setSheet("hours")} />
        <Row icon={<MapPin className="h-5 w-5" />} label="Service Radius" value={`${radius} km`} onClick={() => setSheet("radius")} />
      </div>

      <div className="mt-6 space-y-3 px-5">
        <Link to="/staff" className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Users className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold">Manage Staff</div>
            <div className="truncate text-xs text-muted-foreground">Add or remove team members</div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <Row icon={<Settings className="h-5 w-5" />} label="Settings" value={`${prefs.language} • Notifications ${prefs.notifications ? "on" : "off"}`} onClick={() => setSheet("settings")} />
        <Row icon={<HelpCircle className="h-5 w-5" />} label="Help & Support" value="FAQs, call & chat with us" onClick={() => setSheet("help")} />
      </div>

      <div className="mt-6 px-5 pb-6">
        <Link to="/" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-4 font-bold text-destructive">
          <LogOut className="h-4 w-4" /> Logout
        </Link>
        <div className="mt-4 text-center text-[11px] text-muted-foreground">AutoXpert Merchant v1.0.0</div>
      </div>

      {sheet === "services" && (
        <InventorySheet
          services={services}
          onSave={(v) => { setServices(v); save(K.services, v); }}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "shop" && (
        <ShopSheet value={shop} onSave={(v) => { setShop(v); save(K.shop, v); }} onClose={() => setSheet(null)} />
      )}
      {sheet === "vehicles" && (
        <VehiclesSheet value={vehicles} onSave={(v) => { setVehicles(v); save(K.vehicles, v); }} onClose={() => setSheet(null)} />
      )}
      {sheet === "hours" && (
        <HoursSheet value={hours} onSave={(v) => { setHours(v); save(K.hours, v); }} onClose={() => setSheet(null)} />
      )}
      {sheet === "radius" && (
        <RadiusSheet value={radius} onSave={(v) => { setRadius(v); save(K.radius, v); }} onClose={() => setSheet(null)} />
      )}
      {sheet === "settings" && (
        <SettingsSheet value={prefs} onSave={(v) => { setPrefs(v); save(K.prefs, v); }} onClose={() => setSheet(null)} />
      )}
      {sheet === "help" && <HelpSheet onClose={() => setSheet(null)} />}
    </MobileShell>
  );
}

/* ---------- shared sheet shell ---------- */

function Sheet({ title, subtitle, onClose, children, footer }: { title: string; subtitle?: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-foreground/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet safe-bottom">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold">{title}</h3>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        <div className="mt-4 max-h-[55vh] overflow-y-auto">{children}</div>
        {footer}
      </div>
    </div>
  );
}

function SaveBtn({ onClick, label = "Save Changes" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="mt-4 w-full rounded-2xl bg-gradient-primary py-3.5 font-bold text-primary-foreground shadow-elevated">
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputCls = "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold outline-none focus:border-primary";

/* ---------- Shop Information ---------- */

function ShopSheet({ value, onSave, onClose }: { value: Shop; onSave: (v: Shop) => void; onClose: () => void }) {
  const [s, setS] = useState<Shop>(value);
  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setS((p) => ({ ...p, photo: URL.createObjectURL(f) }));
  };
  return (
    <Sheet title="Shop Information" subtitle="Update your shop profile details" onClose={onClose}
      footer={<SaveBtn onClick={() => { onSave(s); onClose(); }} />}>
      <label className="mb-4 flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft">
        {s.photo ? <img src={s.photo} alt="Shop" className="h-full w-full object-cover" /> : (
          <div className="flex flex-col items-center gap-1 text-primary">
            <Camera className="h-6 w-6" />
            <span className="text-xs font-bold">Update Shop Photo</span>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
      </label>
      <Field label="Shop Name"><input className={inputCls} value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} /></Field>
      <Field label="Owner Name"><input className={inputCls} value={s.owner} onChange={(e) => setS({ ...s, owner: e.target.value })} /></Field>
      <Field label="Mobile"><input className={inputCls} inputMode="tel" value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} /></Field>
      <Field label="Address"><textarea rows={3} className={inputCls} value={s.address} onChange={(e) => setS({ ...s, address: e.target.value })} /></Field>
    </Sheet>
  );
}

/* ---------- Vehicle Types ---------- */

function VehiclesSheet({ value, onSave, onClose }: { value: string[]; onSave: (v: string[]) => void; onClose: () => void }) {
  const [list, setList] = useState<string[]>(value);
  const toggle = (v: string) => setList((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));
  return (
    <Sheet title="Vehicle Types" subtitle="Select vehicles your shop can service" onClose={onClose}
      footer={<SaveBtn onClick={() => { onSave(list); onClose(); }} />}>
      <div className="grid grid-cols-2 gap-2">
        {ALL_VEHICLES.map((v) => {
          const on = list.includes(v);
          return (
            <button key={v} onClick={() => toggle(v)}
              className={`rounded-2xl border-2 p-3 text-sm font-bold transition ${on ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground"}`}>
              {v}
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

/* ---------- Working Hours ---------- */

function HoursSheet({ value, onSave, onClose }: { value: Hours; onSave: (v: Hours) => void; onClose: () => void }) {
  const [h, setH] = useState<Hours>(value);
  const toggleDay = (d: string) => setH((p) => ({ ...p, days: p.days.includes(d) ? p.days.filter((x) => x !== d) : [...p.days, d] }));
  return (
    <Sheet title="Working Hours" subtitle="Leads will arrive only during these hours" onClose={onClose}
      footer={<SaveBtn onClick={() => { onSave(h); onClose(); }} />}>
      <div className="flex gap-3">
        <Field label="Opens"><input type="time" className={inputCls} value={h.open} onChange={(e) => setH({ ...h, open: e.target.value })} /></Field>
        <Field label="Closes"><input type="time" className={inputCls} value={h.close} onChange={(e) => setH({ ...h, close: e.target.value })} /></Field>
      </div>
      <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Working Days</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {DAYS.map((d) => {
          const on = h.days.includes(d);
          return (
            <button key={d} onClick={() => toggleDay(d)}
              className={`h-11 w-11 rounded-full border-2 text-xs font-bold transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
              {d}
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

/* ---------- Service Radius ---------- */

function RadiusSheet({ value, onSave, onClose }: { value: number; onSave: (v: number) => void; onClose: () => void }) {
  const [r, setR] = useState(value);
  return (
    <Sheet title="Service Radius" subtitle="How far you're willing to travel for a job" onClose={onClose}
      footer={<SaveBtn onClick={() => { onSave(r); onClose(); }} />}>
      <div className="rounded-2xl bg-primary-soft p-6 text-center">
        <div className="text-5xl font-extrabold text-primary">{r}</div>
        <div className="text-xs font-bold uppercase tracking-wide text-primary/70">kilometres</div>
      </div>
      <input type="range" min={1} max={50} step={1} value={r} onChange={(e) => setR(Number(e.target.value))} className="mt-5 w-full accent-[hsl(var(--primary))]" />
      <div className="mt-1 flex justify-between text-[11px] font-semibold text-muted-foreground"><span>1 km</span><span>50 km</span></div>
      <div className="mt-4 flex gap-2">
        {[5, 10, 15, 25].map((p) => (
          <button key={p} onClick={() => setR(p)} className={`flex-1 rounded-xl border-2 py-2 text-xs font-bold ${r === p ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground"}`}>{p} km</button>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Settings ---------- */

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-primary" : "bg-border"}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-card shadow transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

function SettingsSheet({ value, onSave, onClose }: { value: Prefs; onSave: (v: Prefs) => void; onClose: () => void }) {
  const [p, setP] = useState<Prefs>(value);
  const langs = ["English", "हिंदी", "मराठी", "ಕನ್ನಡ"];
  const rows: { label: string; desc: string; key: "notifications" | "sound" | "autoAccept" }[] = [
    { label: "Push Notifications", desc: "Get alerts for new leads", key: "notifications" },
    { label: "Lead Sound Alert", desc: "Play a ring when a lead arrives", key: "sound" },
    { label: "Auto-accept Leads", desc: "Accept leads within your radius automatically", key: "autoAccept" },
  ];
  return (
    <Sheet title="Settings" subtitle="App preferences" onClose={onClose}
      footer={<SaveBtn onClick={() => { onSave(p); onClose(); }} />}>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">{r.label}</div>
              <div className="text-[11px] text-muted-foreground">{r.desc}</div>
            </div>
            <Toggle on={p[r.key]} onChange={(v) => setP({ ...p, [r.key]: v })} />
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">Language</div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {langs.map((l) => (
          <button key={l} onClick={() => setP({ ...p, language: l })}
            className={`rounded-2xl border-2 p-3 text-sm font-bold transition ${p.language === l ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground"}`}>
            {l}
          </button>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Help & Support ---------- */

const FAQS = [
  { q: "How do I receive leads?", a: "Go Online from the dashboard. Leads within your service radius will pop up automatically — accept within 30 seconds." },
  { q: "When do I get paid?", a: "Cash jobs are settled instantly. Online payments are transferred to your bank account within 24 hours of job completion." },
  { q: "Why is my KYC pending?", a: "Complete shop details, owner selfie and one ID document from onboarding. Verification usually takes under 2 hours." },
  { q: "Can I assign a job to my staff?", a: "Yes. Open the job, tap Assign Staff and pick an online team member, or start the job yourself." },
  { q: "How is the tow van rate decided?", a: "Tow van jobs run on a fixed ₹1,500 rate — no negotiation needed." },
];

function HelpSheet({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Sheet title="Help & Support" subtitle="We're here 24×7" onClose={onClose}>
      <div className="grid grid-cols-3 gap-2">
        <a href="tel:+918000000000" className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 text-primary">
          <Phone className="h-5 w-5" /><span className="text-[11px] font-bold">Call</span>
        </a>
        <a href="https://wa.me/918000000000" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 text-primary">
          <MessageCircle className="h-5 w-5" /><span className="text-[11px] font-bold">Chat</span>
        </a>
        <a href="mailto:support@autoxpert.in" className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 text-primary">
          <Mail className="h-5 w-5" /><span className="text-[11px] font-bold">Email</span>
        </a>
      </div>
      <div className="mt-4 space-y-2">
        {FAQS.map((f, i) => (
          <div key={f.q} className="overflow-hidden rounded-2xl border border-border bg-card">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-3 p-4 text-left">
              <span className="flex-1 text-sm font-bold">{f.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="px-4 pb-4 text-xs leading-relaxed text-muted-foreground">{f.a}</p>}
          </div>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Services Inventory ---------- */

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
  const remove = (id: string) => setList((arr) => arr.filter((s) => s.id !== id));
  const updatePrice = (id: string, p: number) => setList((arr) => arr.map((s) => (s.id === id ? { ...s, price: p } : s)));

  return (
    <Sheet title="Services Inventory" subtitle="Set your own prices for each service" onClose={onClose}
      footer={<SaveBtn onClick={() => { onSave(list); onClose(); }} label="Save Inventory" />}>
      <div className="space-y-2">
        {list.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-xl">{s.icon}</div>
            <div className="flex-1 text-sm font-bold">{s.name}</div>
            <div className="flex items-center gap-1 rounded-xl border border-border bg-background px-2 py-1.5">
              <span className="text-xs font-bold text-muted-foreground">₹</span>
              <input inputMode="numeric" value={s.price} onChange={(e) => updatePrice(s.id, parseInt(e.target.value || "0", 10))} className="w-16 bg-transparent text-sm font-bold outline-none" />
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
    </Sheet>
  );
}

/* ---------- Row ---------- */

function Row({ icon, label, value, onClick, badge }: { icon: ReactNode; label: string; value?: string; onClick?: () => void; badge?: number }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card active:scale-[0.99] transition">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold">{label}</div>
        {value && <div className="truncate text-xs text-muted-foreground">{value}</div>}
      </div>
      {badge !== undefined && <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">{badge}</span>}
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}
