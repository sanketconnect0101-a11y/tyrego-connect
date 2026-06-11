import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { X } from "lucide-react";

export const Route = createFileRoute("/otp")({ component: Otp });

function Otp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handle = (i: number, v: string) => {
    const val = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 3) refs.current[i + 1]?.focus();
  };

  const complete = otp.every((c) => c);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-gradient-hero text-white">
      {/* Splash bg */}
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

      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />

      <div className="absolute inset-x-0 bottom-0 z-10 animate-sheet-up rounded-t-3xl bg-card p-6 text-foreground shadow-sheet safe-bottom">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
        <Link to="/login" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
          <X className="h-4 w-4" />
        </Link>
        <div className="text-3xl">📲</div>
        <h2 className="mt-2 text-2xl font-extrabold">Verify OTP</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter 4-digit code sent to <span className="font-semibold text-foreground">+91 98765 43210</span>
        </p>

        <div className="mt-7 flex justify-center gap-3">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              onChange={(e) => handle(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
              inputMode="numeric"
              className={`h-14 w-14 rounded-2xl border-2 bg-background text-center text-2xl font-bold outline-none transition ${d ? "border-primary text-primary" : "border-border"}`}
            />
          ))}
        </div>

        <button className="mt-5 block w-full text-center text-sm font-semibold text-primary">Resend code in 0:28</button>

        <button
          onClick={() => navigate({ to: "/onboarding/shop" })}
          disabled={!complete}
          className="mt-6 w-full rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated disabled:opacity-40 active:scale-[0.98] transition"
        >
          Verify & Continue →
        </button>
      </div>
    </div>
  );
}
