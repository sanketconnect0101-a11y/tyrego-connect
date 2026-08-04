import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { Check, Mic, Square, Play, Pause, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/job/$id/progress")({ component: Progress });

const STEPS = ["Reached Customer", "Inspection", "Repairing", "Completed"];
const SERVICES = ["Puncture Fixed", "Tyre Replaced", "Air Filled", "Wheel Changed"];
const STATUS_OPTIONS = [
  { id: "attended", label: "Customer attended", icon: "✅" },
  { id: "not_available", label: "Customer not available", icon: "❌" },
  { id: "work_done", label: "Work completed", icon: "🔧" },
  { id: "partial", label: "Partial work done", icon: "⚠️" },
  { id: "reschedule", label: "Reschedule needed", icon: "🔁" },
];

function Progress() {
  const { id } = Route.useParams();
  const [step, setStep] = useState(2);
  const [services, setServices] = useState<Set<string>>(new Set(["Puncture Fixed"]));
  const [status, setStatus] = useState<Set<string>>(new Set(["attended"]));
  const [extraServices, setExtraServices] = useState<string[]>([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState("");

  const allServices = [...SERVICES, ...extraServices];

  const toggle = (s: string) => {
    const n = new Set(services);
    n.has(s) ? n.delete(s) : n.add(s);
    setServices(n);
  };
  const toggleStatus = (s: string) => {
    const n = new Set(status);
    n.has(s) ? n.delete(s) : n.add(s);
    setStatus(n);
  };
  const addService = () => {
    const trimmed = newService.trim();
    if (!trimmed) return;
    if (!allServices.includes(trimmed)) setExtraServices((prev) => [...prev, trimmed]);
    setServices((prev) => new Set(prev).add(trimmed));
    setNewService("");
    setShowAddService(false);
  };
  const removeExtra = (s: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExtraServices((prev) => prev.filter((x) => x !== s));
    setServices((prev) => {
      const n = new Set(prev);
      n.delete(s);
      return n;
    });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Job In Progress" back />

      <div className="space-y-5 p-5">
        {/* Timeline */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Progress</div>
          <div className="mt-4 space-y-1">
            {STEPS.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <div key={s} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <button onClick={() => setStep(i + 1)} className={`flex h-8 w-8 items-center justify-center rounded-full transition ${done ? "bg-success text-success-foreground" : current ? "bg-primary text-primary-foreground animate-pulse-ring" : "bg-secondary text-muted-foreground"}`}>
                      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </button>
                    {i < STEPS.length - 1 && <div className={`my-1 h-8 w-0.5 ${done ? "bg-success" : "bg-border"}`} />}
                  </div>
                  <div className="flex-1 pb-4 pt-1">
                    <div className={`text-sm font-bold ${done ? "text-success" : current ? "text-primary" : "text-muted-foreground"}`}>{s}</div>
                    {current && <div className="text-xs text-muted-foreground">In progress now…</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services completed */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Service Completed</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {SERVICES.map((s) => {
              const active = services.has(s);
              return (
                <button key={s} onClick={() => toggle(s)} className={`flex items-center gap-2 rounded-xl border-2 p-3 text-left text-xs font-semibold transition ${active ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-foreground"}`}>
                  <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  </div>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status checkboxes (replaces note) */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Job Status</div>
          <div className="mt-3 space-y-2">
            {STATUS_OPTIONS.map((o) => {
              const active = status.has(o.id);
              return (
                <button
                  key={o.id}
                  onClick={() => toggleStatus(o.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}
                >
                  <div className={`flex h-6 w-6 items-center justify-center rounded-md border-2 ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </div>
                  <span className="text-base">{o.icon}</span>
                  <span className={`flex-1 text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>{o.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice note */}
        <VoiceNote />
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur safe-bottom">
        <Link to="/job/$id/payment" params={{ id }} className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated">
          End Job → Collect Payment
        </Link>
      </div>
    </div>
  );
}

function VoiceNote() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      setDuration(0);
      timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      setError("Microphone access denied");
    }
  };

  const stop = () => {
    mediaRef.current?.stop();
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const remove = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    setPlaying(false);
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Voice Note (optional)</div>

      {!audioUrl ? (
        <div className="mt-3 flex flex-col items-center gap-3 rounded-2xl bg-primary-soft p-5">
          <button
            onClick={recording ? stop : start}
            className={`relative flex h-16 w-16 items-center justify-center rounded-full text-primary-foreground shadow-elevated transition ${recording ? "bg-destructive" : "bg-gradient-primary"}`}
          >
            {recording && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />}
            {recording ? <Square className="relative h-6 w-6" fill="currentColor" /> : <Mic className="relative h-7 w-7" />}
          </button>
          <div className="text-sm font-bold">
            {recording ? `Recording... ${fmt(duration)}` : "Tap to record voice note"}
          </div>
          {error && <div className="text-[11px] text-destructive">{error}</div>}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-primary-soft p-4">
          <button onClick={togglePlay} className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elevated">
            {playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
          </button>
          <div className="flex-1">
            <div className="text-sm font-bold">Voice Note</div>
            <div className="text-xs text-muted-foreground">{fmt(duration)} recorded</div>
            <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} className="hidden" />
          </div>
          <button onClick={remove} className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
