import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type TimeDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function parseTime(value: string | undefined): { hour: number; minute: number } {
  if (!value) return { hour: 0, minute: 0 };
  const [h, m] = value.split(":");
  const hour = Math.max(0, Math.min(23, Number(h ?? 0)));
  const minute = Math.max(0, Math.min(59, Number(m ?? 0)));
  return { hour, minute };
}

function TimeDropdown({ value, onChange, placeholder = "اختر الوقت" }: TimeDropdownProps) {
  const [open, setOpen] = useState(false);
  const { hour: initialHour, minute: initialMinute } = parseTime(value);
  const [hour, setHour] = useState<number>(initialHour);
  const [minute, setMinute] = useState<number>(initialMinute);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { hour: h, minute: m } = parseTime(value);
    setHour(h);
    setMinute(m);
  }, [value]);

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [open]);

  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // كل 5 دقائق
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const display = value ? value : placeholder;

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="min-w-[120px] justify-between"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>{display}</span>
        <span className="text-muted-foreground">⏷</span>
      </Button>
      {open ? (
        <div
          role="dialog"
          className="absolute z-50 mt-2 w-[260px] rounded-md border bg-popover p-3 shadow-md right-0"
        >
          <div className="mb-2 text-xs text-muted-foreground">اختر الساعة والدقيقة</div>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="mb-1 text-[10px] text-muted-foreground">ساعة</div>
              <div className="grid grid-cols-4 gap-1 max-h-40 overflow-auto pr-1">
                {hours.map((h) => (
                  <Button
                    key={h}
                    type="button"
                    size="sm"
                    variant={h === hour ? "secondary" : "ghost"}
                    className="h-8 px-2"
                    onClick={() => setHour(h)}
                  >
                    {pad2(h)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-1 text-[10px] text-muted-foreground">دقيقة</div>
              <div className="grid grid-cols-4 gap-1 max-h-40 overflow-auto pr-1">
                {minutes.map((m) => (
                  <Button
                    key={m}
                    type="button"
                    size="sm"
                    variant={m === minute ? "secondary" : "ghost"}
                    className="h-8 px-2"
                    onClick={() => {
                      setMinute(m);
                      onChange(`${pad2(hour)}:${pad2(m)}`);
                      setOpen(false);
                    }}
                  >
                    {pad2(m)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TimeRangePicker() {
  const [startTime, setStartTime] = useState("05:08");
  const [endTime, setEndTime] = useState("12:42");

  const clearTimes = () => {
    setStartTime("");
    setEndTime("");
  };

  return (
    <div
      dir="rtl"
      className="group flex items-center gap-2 rounded-lg border bg-background/70 px-3 py-2 w-fit shadow-xs border-input hover:shadow-sm focus-within:ring-2 focus-within:ring-ring/40 transition"
    >
      {/* وقت البداية */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">من</span>
        <TimeDropdown value={startTime} onChange={setStartTime} placeholder="اختر" />
      </div>

      {/* السهم */}
      <span className="mx-1 text-muted-foreground">→</span>

      {/* وقت النهاية */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">إلى</span>
        <TimeDropdown value={endTime} onChange={setEndTime} placeholder="اختر" />
      </div>

      {/* زر المسح */}
      <Button
        type="button"
        onClick={clearTimes}
        variant="ghost"
        size="sm"
        className="ml-1 size-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
        aria-label="مسح الوقت"
        title="مسح الوقت"
      >
        ×
      </Button>
    </div>
  );
}
