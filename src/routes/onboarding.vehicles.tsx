import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { Stepper } from "./onboarding.shop";
import { Camera, MapPin, Loader2, Check, X, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/onboarding/vehicles")({ component: OwnerLocation });

function OwnerLocation() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [showCam, setShowCam] = useState(false);



  const fetchLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      // fallback demo
      setTimeout(() => {
        setCoords({ lat: 19.1197, lng: 72.8468 });
        setAddress("MG Road, Andheri East, Mumbai, Maharashtra 400069");
        setLoading(false);
      }, 1200);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: +pos.coords.latitude.toFixed(6), lng: +pos.coords.longitude.toFixed(6) });
        setAddress("Current location detected (auto-filled)");
        setLoading(false);
      },
      () => {
        setCoords({ lat: 19.1197, lng: 72.8468 });
        setAddress("MG Road, Andheri East, Mumbai, Maharashtra 400069");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const canContinue = photo && coords && address.length > 4;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Your Photo & Location" />
      <Stepper step={2} />

      <div className="flex-1 space-y-5 px-5 pt-2">
        <div className="rounded-2xl bg-primary-soft p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📸</div>
            <div>
              <div className="font-bold">Add your photo & shop location</div>
              <div className="text-xs text-muted-foreground">Location auto-detects from GPS</div>
            </div>
          </div>
        </div>

        {/* Owner photo */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your Selfie</label>
          <button
            type="button"
            onClick={() => setShowCam(true)}
            className="mt-2 flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-primary/40 bg-card p-4 text-left"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-primary-soft">
              {photo ? (
                <img src={photo} alt="Owner" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-primary">
                  <Camera className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">{photo ? "Photo captured ✓ — Retake" : "Take Selfie (Open Camera)"}</div>
              <div className="text-[11px] text-muted-foreground">No upload — captured live from camera</div>
            </div>
          </button>
        </div>


        {/* Location */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shop Location</label>

          {!coords ? (
            <button
              onClick={fetchLocation}
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft py-5 font-bold text-primary"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
              {loading ? "Detecting location..." : "Auto-Detect My Location"}
            </button>
          ) : (
            <div className="mt-2 space-y-2 rounded-2xl border-2 border-primary/30 bg-primary-soft p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Check className="h-4 w-4" /> Location detected
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-card p-2">
                  <div className="text-[10px] text-muted-foreground">Latitude</div>
                  <div className="text-sm font-bold">{coords.lat}</div>
                </div>
                <div className="rounded-xl bg-card p-2">
                  <div className="text-[10px] text-muted-foreground">Longitude</div>
                  <div className="text-sm font-bold">{coords.lng}</div>
                </div>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium outline-none focus:border-primary"
              />
              <button onClick={fetchLocation} className="text-xs font-bold text-primary">↻ Re-detect</button>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur-lg safe-bottom">
        {canContinue ? (
          <Link to="/onboarding/staff" className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated">
            Continue →
          </Link>
        ) : (
          <button disabled className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground opacity-40">
            Add photo & location
          </button>
        )}
      </div>

      {showCam && (
        <CameraSheet
          onClose={() => setShowCam(false)}
          onCapture={(data) => { setPhoto(data); setShowCam(false); }}
        />
      )}
    </div>
  );
}

function CameraSheet({ onClose, onCapture }: { onClose: () => void; onCapture: (dataUrl: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch (e: any) {
        setError(e?.message ?? "Camera permission denied");
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const v = videoRef.current;
    if (!v) return;
    const size = Math.min(v.videoWidth, v.videoHeight) || 480;
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const sx = (v.videoWidth - size) / 2;
    const sy = (v.videoHeight - size) / 2;
    // Mirror selfie
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, sx, sy, size, size, 0, 0, size, size);
    onCapture(canvas.toDataURL("image/jpeg", 0.85));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground">
      <div className="flex items-center justify-between p-5 text-white safe-top">
        <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"><X className="h-5 w-5" /></button>
        <div className="text-sm font-bold">Take Selfie</div>
        <div className="h-10 w-10" />
      </div>
      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <Camera className="h-12 w-12 opacity-50" />
            <div className="mt-3 text-sm font-bold">Cannot access camera</div>
            <div className="mt-1 text-xs text-white/70">{error}</div>
          </div>
        ) : (
          <>
            <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full -scale-x-100 object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 rounded-full border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
            </div>
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-8 p-6 safe-bottom">
        <button onClick={onClose} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white">
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          onClick={capture}
          disabled={!ready}
          className="h-20 w-20 rounded-full border-4 border-white bg-white/20 backdrop-blur disabled:opacity-40"
        >
          <div className="mx-auto h-14 w-14 rounded-full bg-white" />
        </button>
        <div className="h-12 w-12" />
      </div>
    </div>
  );
}

