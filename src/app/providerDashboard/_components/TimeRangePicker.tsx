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

function parseTime(value: string | undefined): {
  hour: number;
  minute: number;
} {
  if (!value) return { hour: 0, minute: 0 };
  const [h, m] = value.split(":");
  const hour = Math.max(0, Math.min(23, Number(h ?? 0)));
  const minute = Math.max(0, Math.min(59, Number(m ?? 0)));
  return { hour, minute };
}

function to12Hour(hour24: number): { hour12: number; isPM: boolean } {
  const isPM = hour24 >= 12;
  const raw = hour24 % 12;
  const hour12 = raw === 0 ? 12 : raw;
  return { hour12, isPM };
}

function to24Hour(hour12: number, isPM: boolean): number {
  if (hour12 === 12) {
    return isPM ? 12 : 0;
  }
  return isPM ? hour12 + 12 : hour12;
}

function TimeDropdown({
  value,
  onChange,
  placeholder = "Select time",
}: TimeDropdownProps) {
  const [open, setOpen] = useState(false);
  const { hour: initialHour24, minute: initialMinute } = parseTime(value);
  const { hour12: initialHour12, isPM: initialIsPM } = to12Hour(initialHour24);
  const [hour12, setHour12] = useState<number>(initialHour12);
  const [isPM, setIsPM] = useState<boolean>(initialIsPM);
  const [minute, setMinute] = useState<number>(initialMinute);
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const { hour: h24, minute: m } = parseTime(value);
    const { hour12: h12, isPM: pm } = to12Hour(h24);
    setHour12(h12);
    setIsPM(pm);
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

  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // Every 5 minutes
  const hours12 = Array.from({ length: 12 }, (_, i) => i + 1);

  const display = value
    ? (() => {
        const { hour: h24, minute: m } = parseTime(value);
        const { hour12: h12, isPM: pm } = to12Hour(h24);
        return `${pad2(h12)}:${pad2(m)} ${pm ? "PM" : "AM"}`;
      })()
    : placeholder;

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
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {display}
        </span>
        <span className="text-muted-foreground">⏷</span>
      </Button>
      {open ? (
        <div
          role="dialog"
          className="absolute z-50 mt-2 w-[220px] rounded-md border bg-popover p-2 shadow-md left-0"
        >
          <div className="mb-1 text-xs text-muted-foreground">Select time</div>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <div className="mb-1 text-[10px] text-muted-foreground">Hour</div>
              <div className="flex flex-col gap-1 max-h-48 overflow-auto pl-1">
                {hours12.map((h12) => (
                  <Button
                    key={h12}
                    type="button"
                    size="sm"
                    variant={h12 === hour12 ? "secondary" : "ghost"}
                    className="h-8 px-2 justify-start"
                    onClick={() => {
                      setHour12(h12);
                      const h24 = to24Hour(h12, isPM);
                      onChange(`${pad2(h24)}:${pad2(minute)}`);
                    }}
                  >
                    {pad2(h12)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-1 text-[10px] text-muted-foreground">
                Minute
              </div>
              <div className="flex flex-col gap-1 max-h-48 overflow-auto pl-1">
                {minutes.map((m) => (
                  <Button
                    key={m}
                    type="button"
                    size="sm"
                    variant={m === minute ? "secondary" : "ghost"}
                    className="h-8 px-2 justify-start"
                    onClick={() => {
                      setMinute(m);
                      const h24 = to24Hour(hour12, isPM);
                      onChange(`${pad2(h24)}:${pad2(m)}`);
                      setOpen(false);
                    }}
                  >
                    {pad2(m)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="w-[56px]">
              <div className="mb-1 text-[10px] text-muted-foreground">
                Period
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant={!isPM ? "secondary" : "ghost"}
                  className="h-8 px-2"
                  onClick={() => {
                    setIsPM(false);
                    const h24 = to24Hour(hour12, false);
                    onChange(`${pad2(h24)}:${pad2(minute)}`);
                  }}
                >
                  AM
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={isPM ? "secondary" : "ghost"}
                  className="h-8 px-2"
                  onClick={() => {
                    setIsPM(true);
                    const h24 = to24Hour(hour12, true);
                    onChange(`${pad2(h24)}:${pad2(minute)}`);
                  }}
                >
                  PM
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TimeRangePicker({
  startTime,
  endTime,
  setStartTime,
  setEndTime,
}: {
  startTime: string;
  endTime: string;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
}) {
  const clearTimes = () => {
    setStartTime("");
    setEndTime("");
  };

  return (
    <div
      dir="ltr"
      className="group flex items-center gap-2 rounded-lg border bg-background/70 px-3 py-2 w-fit shadow-xs border-input hover:shadow-sm focus-within:ring-2 focus-within:ring-ring/40 transition"
    >
      {/* Start time */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">From</span>
        <TimeDropdown
          value={startTime}
          onChange={setStartTime}
          placeholder="Select"
        />
      </div>

      {/* Arrow */}
      <span className="mx-1 text-muted-foreground">→</span>

      {/* End time */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">To</span>
        <TimeDropdown
          value={endTime}
          onChange={setEndTime}
          placeholder="Select"
        />
      </div>

      {/* Clear button */}
      <Button
        type="button"
        onClick={clearTimes}
        variant="ghost"
        size="sm"
        className="mr-1 size-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
        aria-label="Clear time"
        title="Clear time"
      >
        ×
      </Button>
    </div>
  );
}
