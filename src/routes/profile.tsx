import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { ChevronRight, Store, Truck, Wrench, Clock, MapPin, LogOut, Star, Settings, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  return (
    <MobileShell>
      <div className="bg-gradient-hero px-5 pb-16 pt-12 text-white safe-top">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">🏪</div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-extrabold">Sharma Tyre Works</div>
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
        <Row icon={<Wrench className="h-5 w-5" />} label="Services Offered" value="Puncture, Air, Replacement" />
        <Row icon={<Clock className="h-5 w-5" />} label="Working Hours" value="9:00 AM – 9:00 PM" />
        <Row icon={<MapPin className="h-5 w-5" />} label="Service Radius" value="10 km" />
      </div>

      <div className="mt-6 space-y-3 px-5">
        <Row icon={<Settings className="h-5 w-5" />} label="Settings" />
        <Row icon={<HelpCircle className="h-5 w-5" />} label="Help & Support" />
      </div>

      <div className="mt-6 px-5 pb-6">
        <Link to="/" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-4 font-bold text-destructive">
          <LogOut className="h-4 w-4" /> Logout
        </Link>
        <div className="mt-4 text-center text-[11px] text-muted-foreground">TyreGo Merchant v1.0.0</div>
      </div>
    </MobileShell>
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
