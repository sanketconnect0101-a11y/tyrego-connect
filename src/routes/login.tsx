import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-gradient-hero text-white">
      {/* Splash background visible behind */}
      <div className="pointer-events-none flex flex-1 flex-col items-center justify-start px-6 pt-16 text-center opacity-70">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur-lg">
            <div className="text-5xl">🔧</div>
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">AutoXpert</h1>
        <p className="mt-1 text-xs font-medium text-white/80">Roadside Auto Service Network</p>
      </div>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />

      {/* Popup card */}
      <div className="absolute inset-x-0 bottom-0 z-10 animate-sheet-up rounded-t-3xl bg-card p-6 text-foreground shadow-sheet safe-bottom">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
        <Link to="/" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
          <X className="h-4 w-4" />
        </Link>
        <div className="text-3xl">👋</div>
        <h2 className="mt-2 text-2xl font-extrabold">Welcome to AutoXpert</h2>
        <p className="mt-1 text-sm text-muted-foreground">Login with your registered mobile number</p>

        <form
          onSubmit={(e) => { e.preventDefault(); if (phone.length >= 10) navigate({ to: "/otp" }); }}
          className="mt-6"
        >
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mobile Number</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border-2 border-border bg-background px-4 py-1 focus-within:border-primary">
            <span className="font-semibold text-foreground">🇮🇳 +91</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98765 43210"
              className="flex-1 bg-transparent py-3 text-lg font-semibold outline-none"
              autoFocus
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">We'll send you a 4-digit verification code</p>

          <button
            type="submit"
            disabled={phone.length < 10}
            className="mt-6 w-full rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated disabled:opacity-40 active:scale-[0.98] transition"
          >
            Send OTP →
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">By continuing you agree to our Terms & Privacy Policy</p>
        </form>
      </div>
    </div>
  );
}
