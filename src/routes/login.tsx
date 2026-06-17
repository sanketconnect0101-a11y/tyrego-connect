import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { Numpad } from "@/components/Numpad";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const press = (d: string) => setPhone((p) => (p.length >= 10 ? p : p + d));
  const back = () => setPhone((p) => p.slice(0, -1));

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-gradient-hero text-white">
      <div className="pointer-events-none flex flex-1 flex-col items-center justify-start px-6 pt-12 text-center opacity-70">
        <div className="relative mb-4">
          <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-lg">
            <div className="text-4xl">🔧</div>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">AutoXpert</h1>
        <p className="mt-1 text-xs font-medium text-white/80">Roadside Auto Service Network</p>
      </div>

      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />

      <div className="absolute inset-x-0 bottom-0 z-10 animate-sheet-up rounded-t-3xl bg-card p-5 text-foreground shadow-sheet safe-bottom">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
        <Link to="/" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
          <X className="h-4 w-4" />
        </Link>
        <div className="text-2xl">👋</div>
        <h2 className="mt-1 text-xl font-extrabold">Welcome to AutoXpert</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Login with your registered mobile number</p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border-2 border-border bg-background px-4 py-3 focus-within:border-primary">
          <span className="font-semibold text-foreground">🇮🇳 +91</span>
          <div className="flex-1 text-lg font-semibold tracking-wider tabular-nums">
            {phone || <span className="text-muted-foreground">98765 43210</span>}
          </div>
          {phone && <span className="text-xs font-bold text-primary">{phone.length}/10</span>}
        </div>

        <Numpad onPress={press} onBack={back} />

        <button
          onClick={() => phone.length >= 10 && navigate({ to: "/otp" })}
          disabled={phone.length < 10}
          className="mt-4 w-full rounded-2xl bg-gradient-primary py-3.5 text-base font-bold text-primary-foreground shadow-elevated disabled:opacity-40 active:scale-[0.98] transition"
        >
          Send OTP →
        </button>
      </div>
    </div>
  );
}
