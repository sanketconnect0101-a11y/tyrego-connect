import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className="bg-gradient-hero px-6 pb-12 pt-16 text-white">
        <div className="text-6xl">👋</div>
        <h1 className="mt-4 text-3xl font-extrabold">Welcome back</h1>
        <p className="mt-1 text-sm text-white/80">Login to your TyreGo merchant account</p>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); if (phone.length >= 10) navigate({ to: "/otp" }); }}
        className="flex flex-1 flex-col px-6 pt-8"
      >
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mobile Number</label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-4 py-1 focus-within:border-primary">
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
        <p className="mt-2 text-xs text-muted-foreground">We'll send you a 6-digit verification code</p>

        <div className="mt-8 rounded-2xl bg-primary-soft p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔒</div>
            <div className="text-xs leading-relaxed text-foreground/80">
              Your number is safe with us. Used only for job notifications and customer calls.
            </div>
          </div>
        </div>

        <div className="flex-1" />
        <button
          type="submit"
          disabled={phone.length < 10}
          className="mb-8 mt-6 rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated disabled:opacity-40 active:scale-[0.98] transition safe-bottom"
        >
          Send OTP →
        </button>
      </form>
    </div>
  );
}
