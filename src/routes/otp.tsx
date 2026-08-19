import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { Numpad } from "@/components/Numpad";

export const Route = createFileRoute("/otp")({ component: Otp });

function Otp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const press = (d: string) => setOtp((p) => (p.length >= 4 ? p : p + d));
  const back = () => setOtp((p) => p.slice(0, -1));

  const complete = otp.length === 4;

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
      </div>

      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />

      <div className="absolute inset-x-0 bottom-0 z-10 animate-sheet-up rounded-t-3xl bg-card p-5 text-foreground shadow-sheet safe-bottom">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
        <Link to="/login" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
          <X className="h-4 w-4" />
        </Link>
        <div className="text-2xl">📲</div>
        <h2 className="mt-1 text-xl font-extrabold">Verify OTP</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          4-digit code sent to <span className="font-semibold text-foreground">+91 98765 43210</span>
        </p>

        <div className="mt-5 flex justify-center gap-3">
          {[0,1,2,3].map((i) => {
            const d = otp[i] ?? "";
            return (
              <div
                key={i}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 bg-background text-center text-2xl font-bold transition ${d ? "border-primary text-primary" : "border-border"} ${i === otp.length ? "ring-2 ring-primary/30" : ""}`}
              >
                {d}
              </div>
            );
          })}
        </div>

        <Numpad onPress={press} onBack={back} />

        <button className="mt-3 block w-full text-center text-xs font-semibold text-primary">Resend code in 0:28</button>

        <button
          onClick={() => {
            navigate({ to: "/home" });
          }}
          disabled={!complete}
          className="mt-3 w-full rounded-2xl bg-gradient-primary py-3.5 text-base font-bold text-primary-foreground shadow-elevated disabled:opacity-40 active:scale-[0.98] transition"
        >
          Verify & Continue →
        </button>
      </div>
    </div>
  );
}
