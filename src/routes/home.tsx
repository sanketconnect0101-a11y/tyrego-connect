import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronRight, Briefcase, Radio, Zap, ShieldAlert, Globe, X, TrendingUp, Wallet, Banknote, Clock, HelpCircle } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { LeadSheet } from "@/components/LeadSheet";
import { incomingLeads, recentJobs } from "@/lib/mock-data";

export const Route = createFileRoute("/home")({ component: Home });

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
] as const;

const T = {
  en: {
    greet: "Good Morning", earnings: "Today's Earnings", live: "LIVE", cash: "Cash", online: "Online", pending: "Pending",
    viewReport: "View Report", history: "Payment History",
    statusOnline: "You're Online", statusOffline: "You're Offline",
    statusOnSub: "Receiving leads nearby", statusOffSub: "Tap to start receiving leads",
    waiting: "Waiting for new leads…", waitSub: "Popup appears instantly when a customer needs service nearby.",
    simulate: "Simulate Lead Now", activeJobs: "Active Jobs", viewAll: "View all",
    kycTitle: "Complete KYC to start", kycSub: "Finish quick verification to receive leads",
    kycCta: "Complete Now", todayJobs: "Jobs Done", earnLabel: "Earned",
  },
  hi: {
    greet: "सुप्रभात", earnings: "आज की कमाई", live: "लाइव", cash: "कैश", online: "ऑनलाइन", pending: "बकाया",
    viewReport: "रिपोर्ट", history: "पेमेंट हिस्ट्री",
    statusOnline: "आप ऑनलाइन हैं", statusOffline: "आप ऑफलाइन हैं",
    statusOnSub: "नज़दीकी लीड मिल रही हैं", statusOffSub: "लीड पाने के लिए टैप करें",
    waiting: "नई लीड का इंतज़ार…", waitSub: "ग्राहक के अनुरोध पर तुरंत पॉपअप आएगा।",
    simulate: "टेस्ट लीड दिखाएँ", activeJobs: "चालू जॉब्स", viewAll: "सभी देखें",
    kycTitle: "शुरू करने के लिए KYC पूरी करें", kycSub: "लीड पाने के लिए जल्दी वेरिफिकेशन पूरा करें",
    kycCta: "अभी पूरा करें", todayJobs: "पूरे जॉब्स", earnLabel: "कमाई",
  },
  mr: {
    greet: "शुभ सकाळ", earnings: "आजची कमाई", live: "लाइव्ह", cash: "कॅश", online: "ऑनलाइन", pending: "बाकी",
    viewReport: "रिपोर्ट", history: "पेमेंट हिस्ट्री",
    statusOnline: "तुम्ही ऑनलाइन आहात", statusOffline: "तुम्ही ऑफलाइन आहात",
    statusOnSub: "जवळचे लीड मिळतायत", statusOffSub: "लीड घेण्यासाठी टॅप करा",
    waiting: "नवीन लीडची वाट…", waitSub: "ग्राहक मागणी करताच पॉपअप येईल.",
    simulate: "टेस्ट लीड दाखवा", activeJobs: "चालू जॉब्स", viewAll: "सर्व पहा",
    kycTitle: "सुरु करण्यासाठी KYC पूर्ण करा", kycSub: "लीड मिळवण्यासाठी पडताळणी पूर्ण करा",
    kycCta: "आता पूर्ण करा", todayJobs: "केलेले जॉब्स", earnLabel: "कमाई",
  },
} as const;

function Home() {
  const navigate = useNavigate();
  const [online, setOnline] = useState(false);
  const [activeLead, setActiveLead] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "hi" | "mr">("en");
  const [langOpen, setLangOpen] = useState(false);
  const [kycPending, setKycPending] = useState(false);
  const [showKyc, setShowKyc] = useState(false);
  const indexRef = useRef(0);
  const lead = incomingLeads.find((l) => l.id === activeLead);
  const activeJobs = recentJobs.filter((j) => j.status === "active");
  const t = T[lang];

  useEffect(() => {
    try {
      setKycPending(!!localStorage.getItem("autoxpert_kyc_pending") && !localStorage.getItem("autoxpert_kyc_done"));
      const l = localStorage.getItem("autoxpert_lang") as "en"|"hi"|"mr"|null;
      if (l) setLang(l);
    } catch {}
  }, []);

  useEffect(() => {
    if (!online || activeLead || kycPending) return;
    const t = setTimeout(() => {
      const next = incomingLeads[indexRef.current % incomingLeads.length];
      indexRef.current += 1;
      setActiveLead(next.id);
    }, 6000);
    return () => clearTimeout(t);
  }, [online, activeLead, kycPending]);

  const triggerNow = () => {
    if (kycPending) { setShowKyc(true); return; }
    const next = incomingLeads[indexRef.current % incomingLeads.length];
    indexRef.current += 1;
    setActiveLead(next.id);
  };

  const toggleOnline = () => {
    if (kycPending) { setShowKyc(true); return; }
    setOnline((v) => !v);
  };

  const pickLang = (code: "en"|"hi"|"mr") => {
    setLang(code);
    try { localStorage.setItem("autoxpert_lang", code); } catch {}
    setLangOpen(false);
  };

  return (
    <MobileShell>
      {/* Header */}
      <header className="bg-gradient-hero px-5 pb-20 pt-12 text-white safe-top">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary font-extrabold shadow-elevated">
              SA
              <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${online ? "bg-success" : "bg-muted-foreground"}`} />
            </div>
            <div>
              <div className="text-xs font-medium text-white/80">{t.greet},</div>
              <h1 className="text-lg font-extrabold leading-tight">Sharma Auto Works ✓</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLangOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <Globe className="h-4 w-4" />
            </button>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <Bell className="h-4 w-4" />
              <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-warning" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Earnings Hero Card */}
      <section className="-mt-16 px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-elevated">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
              <Wallet className="h-4 w-4" /> {t.earnings}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> {t.live}
            </span>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <div className="text-4xl font-extrabold tracking-tight">₹4,280</div>
            <div className="mb-1 text-xs text-white/75">({activeJobs.length + 6} {t.todayJobs.toLowerCase()})</div>
          </div>

          <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-2xl bg-white/10">
            <Mini icon={<Banknote className="h-3.5 w-3.5" />} label={t.cash} value="₹2,150" />
            <Mini icon={<Wallet className="h-3.5 w-3.5" />} label={t.online} value="₹1,980" divider />
            <Mini icon={<Clock className="h-3.5 w-3.5" />} label={t.pending} value="₹150" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="rounded-2xl bg-white py-3 text-sm font-bold text-primary shadow-card">
              <TrendingUp className="mx-auto mb-0.5 h-4 w-4" /> {t.viewReport}
            </button>
            <button className="rounded-2xl bg-white/15 py-3 text-sm font-bold text-white backdrop-blur">
              <Briefcase className="mx-auto mb-0.5 h-4 w-4" /> {t.history}
            </button>
          </div>
        </div>
      </section>

      {/* KYC banner */}
      {kycPending && (
        <section className="px-5 pt-4">
          <button onClick={() => setShowKyc(true)} className="flex w-full items-center gap-3 rounded-2xl border-2 border-warning/40 bg-warning/10 p-4 text-left shadow-card">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning text-warning-foreground">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-extrabold">{t.kycTitle}</div>
              <div className="text-[11px] text-muted-foreground">{t.kycSub}</div>
            </div>
            <div className="rounded-full bg-warning px-3 py-1.5 text-[11px] font-bold text-warning-foreground">{t.kycCta} →</div>
          </button>
        </section>
      )}

      {/* Online/Offline — center hero when offline, compact pill when online */}
      {online ? (
        <section className="px-5 pt-5">
          <button onClick={toggleOnline} className="flex w-full items-center justify-between rounded-2xl bg-gradient-primary p-3 text-primary-foreground shadow-card">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              <span className="text-sm font-extrabold">{t.statusOnline}</span>
              <span className="text-[11px] text-white/80">• {t.statusOnSub}</span>
            </div>
            <div className="relative h-6 w-11 rounded-full bg-white/30">
              <div className="absolute left-[22px] top-0.5 h-5 w-5 rounded-full bg-white shadow" />
            </div>
          </button>
        </section>
      ) : (
        <section className="flex flex-col items-center px-5 pt-8 pb-2">
          <button
            onClick={toggleOnline}
            className="group relative flex h-44 w-44 flex-col items-center justify-center rounded-full bg-card shadow-elevated transition active:scale-95"
          >
            <span className="absolute inset-0 rounded-full border-4 border-dashed border-border" />
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-secondary text-foreground">
              <div className="text-3xl">😴</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">OFFLINE</div>
            </div>
          </button>
          <div className="mt-4 text-center">
            <div className="text-base font-extrabold">{t.statusOffline}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{t.statusOffSub}</div>
          </div>
          <button onClick={toggleOnline} className="mt-4 rounded-full bg-gradient-primary px-8 py-3 text-sm font-extrabold text-primary-foreground shadow-elevated">
            Go Online
          </button>
        </section>
      )}

      {/* Waiting / simulate (only when online) */}
      {online && (
        <section className="px-5 pt-5">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 text-center shadow-card">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30" />
              <span className="absolute inline-flex h-14 w-14 rounded-full bg-primary/20" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elevated">
                <Radio className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-3 text-sm font-extrabold">{t.waiting}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t.waitSub}</p>
            <button onClick={triggerNow} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-4 py-2 text-xs font-bold text-primary">
              <Zap className="h-3.5 w-3.5" /> {t.simulate}
            </button>
          </div>
        </section>
      )}

      {/* Active Jobs */}
      <section className="px-5 pb-6 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold">{t.activeJobs}</h2>
          <Link to="/jobs" className="text-xs font-bold text-primary">{t.viewAll} →</Link>
        </div>
        <div className="space-y-2">
          {activeJobs.map((j) => (
            <Link to="/job/$id" params={{ id: j.id }} key={j.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/15">
                <div className="h-2 w-2 animate-pulse rounded-full bg-warning" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{j.problem}</div>
                <div className="text-xs text-muted-foreground">{j.customer} • {j.vehicle} • {j.staff ?? "Self"}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">₹{j.amount}</div>
                <div className="text-[10px] text-muted-foreground">{j.time}</div>
              </div>
            </Link>
          ))}
          {activeJobs.length === 0 && (
            <div className="rounded-2xl bg-secondary p-4 text-center text-xs text-muted-foreground">No active jobs right now</div>
          )}
        </div>
      </section>

      {lead && <LeadSheet lead={lead} onClose={() => setActiveLead(null)} />}

      {/* Language picker */}
      {langOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 backdrop-blur-sm" onClick={() => setLangOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-5 shadow-sheet safe-bottom">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Choose Language</h3>
              <button onClick={() => setLangOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-2">
              {LANGS.map((l) => (
                <button key={l.code} onClick={() => pickLang(l.code)} className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left font-bold ${lang === l.code ? "border-primary bg-primary-soft text-primary" : "border-border bg-card"}`}>
                  {l.label}
                  {lang === l.code && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KYC gate popup */}
      {showKyc && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/60 backdrop-blur-sm" onClick={() => setShowKyc(false)}>
          <div onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl bg-card p-6 shadow-sheet safe-bottom">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/15 text-warning">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold">{t.kycTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              To accept leads and earn, complete your shop verification. It takes less than 2 minutes.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="text-success">✓</span> Shop details & photo</li>
              <li className="flex items-center gap-2"><span className="text-success">✓</span> Owner selfie + GPS location</li>
              <li className="flex items-center gap-2"><span className="text-success">✓</span> One verification document</li>
              <li className="flex items-center gap-2"><span className="text-success">✓</span> Services you offer</li>
            </ul>
            <button onClick={() => { setShowKyc(false); navigate({ to: "/onboarding/shop" }); }} className="mt-5 w-full rounded-2xl bg-gradient-primary py-4 font-bold text-primary-foreground shadow-elevated">
              {t.kycCta} →
            </button>
            <button onClick={() => setShowKyc(false)} className="mt-2 w-full py-2 text-xs font-bold text-muted-foreground">Later</button>
          </div>
        </div>
      )}

      {/* Promo */}
      <div className="px-5 pb-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-accent to-primary-soft p-5">
          <div className="max-w-[60%]">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">Earn More</div>
            <h3 className="mt-1 text-lg font-extrabold leading-tight text-foreground">Accept More Leads, Earn More</h3>
            <p className="mt-1 text-xs text-muted-foreground">Top 10% merchants earn ₹50k+ /month</p>
            <button className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
              Know More <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="absolute -bottom-2 -right-2 text-8xl opacity-90">🛠️</div>
        </div>
      </div>
    </MobileShell>
  );
}

function Mini({ icon, label, value, divider }: { icon: React.ReactNode; label: string; value: string; divider?: boolean }) {
  return (
    <div className={`px-3 py-2.5 text-center ${divider ? "border-x border-white/15" : ""}`}>
      <div className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/75">{icon} {label}</div>
      <div className="mt-0.5 text-sm font-extrabold">{value}</div>
    </div>
  );
}
