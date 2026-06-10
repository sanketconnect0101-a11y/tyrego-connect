import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";

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
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 pt-12">
      <button onClick={() => history.back()} className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div className="mt-6">
        <div className="text-5xl">📲</div>
        <h1 className="mt-4 text-3xl font-extrabold">Verify OTP</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter the 4-digit code sent to <span className="font-semibold text-foreground">+91 98765 43210</span></p>
      </div>

      <div className="mt-10 flex justify-center gap-3">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={d}
            onChange={(e) => handle(i, e.target.value)}
            onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
            inputMode="numeric"
            className={`h-16 w-16 rounded-2xl border-2 bg-card text-center text-2xl font-bold outline-none transition ${d ? "border-primary text-primary" : "border-border"}`}
          />
        ))}
      </div>

      <button className="mt-6 self-center text-sm font-semibold text-primary">Resend code in 0:28</button>

      <div className="flex-1" />
      <button
        onClick={() => navigate({ to: "/onboarding/shop" })}
        disabled={!complete}
        className="mb-8 rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated disabled:opacity-40 active:scale-[0.98] transition safe-bottom"
      >
        Verify & Continue →
      </button>
    </div>
  );
}
