import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/MobileShell";
import { Camera, FileText, Check } from "lucide-react";

export const Route = createFileRoute("/onboarding/shop")({ component: Shop });

const DOC_TYPES = [
  { id: "aadhar", label: "Aadhar Card", icon: "🪪" },
  { id: "pan", label: "PAN Card", icon: "💳" },
  { id: "gst", label: "GST Certificate", icon: "📄" },
  { id: "other", label: "Other ID", icon: "📋" },
];

function Shop() {
  const [shopName, setShopName] = useState("");
  const [shopPhoto, setShopPhoto] = useState<string | null>(null);
  const [docType, setDocType] = useState<string | null>(null);
  const [docFile, setDocFile] = useState<string | null>(null);

  const canContinue = shopName.length > 1 && shopPhoto && docType && docFile;

  const onShopPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setShopPhoto(URL.createObjectURL(f));
  };
  const onDocFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setDocFile(f.name);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ScreenHeader title="Shop Details" />
      <Stepper step={1} />

      <div className="flex-1 space-y-5 px-5 pt-2">
        <div className="rounded-2xl bg-primary-soft p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏪</div>
            <div>
              <div className="font-bold">Quick setup</div>
              <div className="text-xs text-muted-foreground">Just 3 things — name, photo & ID</div>
            </div>
          </div>
        </div>

        {/* Shop name */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shop Name</label>
          <input
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="e.g. Sharma Auto Works"
            className="mt-2 w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm font-medium outline-none focus:border-primary"
          />
        </div>

        {/* Shop photo */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shop Photo</label>
          <label className="mt-2 flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft">
            {shopPhoto ? (
              <img src={shopPhoto} alt="Shop" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-primary">
                <Camera className="h-7 w-7" />
                <div className="text-sm font-bold">Upload Shop Photo</div>
                <div className="text-[11px] text-muted-foreground">Tap to take photo / choose</div>
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onShopPhoto} />
          </label>
        </div>

        {/* Document type */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Verification Document</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {DOC_TYPES.map((d) => {
              const active = docType === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDocType(d.id)}
                  className={`flex items-center gap-2 rounded-2xl border-2 p-3 text-left transition ${active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}
                >
                  <span className="text-xl">{d.icon}</span>
                  <span className={`text-xs font-bold ${active ? "text-primary" : ""}`}>{d.label}</span>
                </button>
              );
            })}
          </div>

          {docType && (
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                {docFile ? <Check className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{docFile ?? "Upload document"}</div>
                <div className="text-[11px] text-muted-foreground">PDF / JPG / PNG accepted</div>
              </div>
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={onDocFile} />
            </label>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-card/95 p-5 backdrop-blur-lg safe-bottom">
        {canContinue ? (
          <Link to="/onboarding/vehicles" className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-elevated">
            Continue →
          </Link>
        ) : (
          <button disabled className="flex w-full items-center justify-center rounded-2xl bg-gradient-primary py-4 text-base font-bold text-primary-foreground opacity-40">
            Fill all fields to continue
          </button>
        )}
      </div>
    </div>
  );
}

export function Stepper({ step }: { step: number }) {
  const total = 4;
  return (
    <div className="flex items-center gap-2 px-5 pb-4 pt-1">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition ${i < step ? "bg-primary" : "bg-border"}`} />
      ))}
      <span className="ml-2 text-[11px] font-bold text-muted-foreground">{step}/{total}</span>
    </div>
  );
}
