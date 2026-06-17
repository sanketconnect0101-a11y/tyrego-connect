import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Navigation, X, ShieldCheck } from "lucide-react";
import { Numpad } from "@/components/Numpad";

export const Route = createFileRoute("/job/$id/navigate")({ component: Nav });

const DEMO_OTP = "4821";

function Nav() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);

  const press = (d: string) => { setError(false); setOtp((p) => (p.length >= 4 ? p : p + d)); };
  const back = () => { setError(false); setOtp((p) => p.slice(0, -1)); };

  const verify = () => {
    if (otp === DEMO_OTP) navigate({ to: "/job/$id/progress", params: { id } });
    else setError(true);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      {/* Map */}
      <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-primary-soft via-accent to-background">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(oklch(0.55 0.24 295 / 0.08) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.55 0.24 295 / 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }} />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 600" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M50 550 Q 200 450 180 350 T 320 80" stroke="oklch(0.55 0.24 295)" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 550 Q 200 450 180 350 T 320 80" stroke="white" strokeWidth="2" strokeDasharray="4 8" />
          <circle cx="50" cy="550" r="14" fill="oklch(0.55 0.24 295)" />
          <circle cx="50" cy="550" r="6" fill="white" />
          <circle cx="320" cy="80" r="16" fill="oklch(0.62 0.24 25)" />
        </svg>

        <button onClick={() => history.back()} className="absolute left-4 top-12 flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-elevated">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <div className="absolute right-4 top-12 rounded-2xl bg-card px-4 py-3 shadow-elevated">
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Arriving in</div>
          <div className="text-xl font-extrabold text-primary">12 min</div>
          <div className="text-[10px] text-muted-foreground">2.3 km away</div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="rounded-t-3xl bg-card p-5 shadow-sheet">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-lg">🚗</div>
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wide text-primary">Heading to customer</div>
            <div className="font-bold">Rahul Sharma</div>
            <div className="text-xs text-muted-foreground">Andheri East, Mumbai</div>
          </div>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-success-foreground shadow-elevated">
            <Phone className="h-5 w-5" />
          </button>
        </div>

        <button onClick={() => setShowOtp(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated safe-bottom">
          <Navigation className="h-5 w-5" /> Reached Location
        </button>
      </div>

      {/* Customer OTP centered modal with numpad */}
      {showOtp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowOtp(false)}>
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md animate-scale-in rounded-3xl bg-card p-5 shadow-sheet">
            <button onClick={() => setShowOtp(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
              <X className="h-4 w-4" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-extrabold">Verify Customer OTP</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ask <span className="font-semibold text-foreground">Rahul Sharma</span> for the 4-digit code to start the job.
            </p>

            <div className="mt-4 flex justify-center gap-3">
              {[0,1,2,3].map((i) => {
                const d = otp[i] ?? "";
                return (
                  <div key={i} className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 bg-background text-2xl font-bold transition ${error ? "border-destructive text-destructive" : d ? "border-primary text-primary" : "border-border"} ${i === otp.length ? "ring-2 ring-primary/30" : ""}`}>
                    {d}
                  </div>
                );
              })}
            </div>
            {error && <div className="mt-2 text-center text-xs font-bold text-destructive">Invalid OTP. Try again.</div>}
            <div className="mt-2 text-center text-[11px] text-muted-foreground">Demo OTP: <span className="font-bold text-foreground">{DEMO_OTP}</span></div>

            <Numpad onPress={press} onBack={back} />

            <button
              onClick={verify}
              disabled={otp.length < 4}
              className="mt-4 w-full rounded-2xl bg-gradient-primary py-3.5 font-bold text-primary-foreground shadow-elevated disabled:opacity-40"
            >
              Verify & Start Job →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

