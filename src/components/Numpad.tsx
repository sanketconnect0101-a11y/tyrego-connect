import { Delete } from "lucide-react";

export function Numpad({ onPress, onBack }: { onPress: (d: string) => void; onBack: () => void }) {
  const keys = ["1","2","3","4","5","6","7","8","9"];
  return (
    <div className="mt-5 grid grid-cols-3 gap-2.5">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onPress(k)}
          className="rounded-2xl bg-secondary py-3.5 text-2xl font-extrabold text-foreground active:scale-95 active:bg-primary-soft transition shadow-card"
        >
          {k}
        </button>
      ))}
      <div />
      <button
        type="button"
        onClick={() => onPress("0")}
        className="rounded-2xl bg-secondary py-3.5 text-2xl font-extrabold text-foreground active:scale-95 active:bg-primary-soft transition shadow-card"
      >
        0
      </button>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center justify-center rounded-2xl bg-secondary py-3.5 text-foreground active:scale-95 transition shadow-card"
        aria-label="Backspace"
      >
        <Delete className="h-6 w-6" />
      </button>
    </div>
  );
}
