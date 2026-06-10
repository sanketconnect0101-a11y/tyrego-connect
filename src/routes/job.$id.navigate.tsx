import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Navigation } from "lucide-react";

export const Route = createFileRoute("/job/$id/navigate")({ component: Nav });

function Nav() {
  const { id } = Route.useParams();
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

      {/* Bottom Action Card */}
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

        <div className="my-4 grid grid-cols-3 gap-2 rounded-2xl bg-primary-soft p-3">
          <div className="text-center">
            <div className="text-lg font-extrabold text-primary">2.3</div>
            <div className="text-[10px] font-bold text-muted-foreground">KM</div>
          </div>
          <div className="border-x border-primary/20 text-center">
            <div className="text-lg font-extrabold text-primary">12</div>
            <div className="text-[10px] font-bold text-muted-foreground">MIN</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-extrabold text-primary">₹250</div>
            <div className="text-[10px] font-bold text-muted-foreground">EARN</div>
          </div>
        </div>

        <Link to="/job/$id/progress" params={{ id }} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated safe-bottom">
          <Navigation className="h-5 w-5" /> Reached Location
        </Link>
      </div>
    </div>
  );
}
