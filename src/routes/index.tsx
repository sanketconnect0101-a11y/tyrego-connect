import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-gradient-hero text-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white/15 backdrop-blur-lg">
            <div className="text-7xl">🛞</div>
          </div>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">TyreGo</h1>
        <p className="mt-3 text-base font-medium text-white/85">Roadside Tyre Service Network</p>
        <p className="mt-2 max-w-xs text-sm text-white/65">
          Connect with thousands of customers needing tyre service nearby
        </p>
      </div>
      <div className="px-6 pb-10 safe-bottom">
        <Link
          to="/login"
          className="flex w-full items-center justify-center rounded-2xl bg-white py-4 text-base font-bold text-primary shadow-elevated active:scale-[0.98] transition"
        >
          Get Started →
        </Link>
        <p className="mt-4 text-center text-xs text-white/60">For tyre merchants & service partners</p>
      </div>
    </div>
  );
}
