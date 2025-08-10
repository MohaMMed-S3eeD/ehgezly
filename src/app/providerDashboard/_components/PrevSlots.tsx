import { Slot } from "@prisma/client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSlots } from "../_actions/Slot.action";

interface PrevSlotsProps {
  refreshTrigger?: number;
  date?: Date;
}

const PrevSlots = ({ refreshTrigger, date }: PrevSlotsProps) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setIsLoading(true);
        const slots = await getSlots();
        if (slots.success) {
          setSlots(slots.data);
        }
        console.log(slots);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlots();
  }, [refreshTrigger]);

  const filteredSlots = useMemo(() => {
    const sorted = [...slots].sort(
      (x, y) => new Date(x.startTime).getTime() - new Date(y.startTime).getTime()
    );
    if (!date) return sorted;
    // نطاق اليوم المحلي: [00:00, 24:00)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 24, 0, 0, 0);
    return sorted.filter((s) => {
      const sStart = new Date(s.startTime);
      const sEnd = new Date(s.endTime);
      return sStart < dayEnd && sEnd > dayStart; // أي تقاطع مع اليوم
    });
  }, [slots, date]);

  const getMinutesSinceMidnight = (dt: Date) => dt.getHours() * 60 + dt.getMinutes();
  const formatTimeLabel = (dt: Date) =>
    dt.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  const formatDateDMY = (dt: Date) =>
    `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
  const formatTime12 = (dt: Date) =>
    dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
  const dayTotalMinutes = 24 * 60;
  const hourBoxes = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const halfHourBlocks = useMemo(() => Array.from({ length: 48 }, (_, i) => i), []);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      container.scrollLeft += delta;
      e.preventDefault();
      e.stopPropagation();
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel as EventListener);
  }, []);
  const getBlockStatus = useMemo(() => {
    return halfHourBlocks.map((idx) => {
      const blockStart = idx * 30;
      const blockEnd = blockStart + 30;
      const hasAvailable = filteredSlots.some((s) => {
        const sStart = getMinutesSinceMidnight(new Date(s.startTime));
        const sEnd = getMinutesSinceMidnight(new Date(s.endTime));
        const cs = Math.max(0, Math.min(dayTotalMinutes, sStart));
        const ce = Math.max(0, Math.min(dayTotalMinutes, sEnd));
        return cs < blockEnd && ce > blockStart && !s.isBooked;
      });
      const hasBooked = filteredSlots.some((s) => {
        const sStart = getMinutesSinceMidnight(new Date(s.startTime));
        const sEnd = getMinutesSinceMidnight(new Date(s.endTime));
        const cs = Math.max(0, Math.min(dayTotalMinutes, sStart));
        const ce = Math.max(0, Math.min(dayTotalMinutes, sEnd));
        return cs < blockEnd && ce > blockStart && s.isBooked;
      });
      return hasAvailable ? "available" : hasBooked ? "booked" : "none";
    });
  }, [filteredSlots, halfHourBlocks, dayTotalMinutes]);
  const formatBlockLabel = (minStart: number) => {
    const h = Math.floor(minStart / 60);
    const m = minStart % 60;
    const dt = new Date(2000, 0, 1, h, m, 0, 0);
    return formatTimeLabel(dt);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card/50 shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <div className="text-sm font-medium">Timeline</div>
            <div className="text-xs text-muted-foreground">{date ? formatDateDMY(date) : "Pick a date to view slots"}</div>
          </div>
          {isLoading && (
            <span className="text-xs text-muted-foreground">Loading...</span>
          )}
        </div>

        <div className="space-y-3 p-4">
          <div className="overflow-x-auto overscroll-contain" ref={scrollRef}>
            {/* شريط علامات الساعات */}
            <div className="rounded-lg bg-gradient-to-r from-muted/50 via-background to-muted/50 p-2">
              <div className="grid grid-cols-[repeat(48,minmax(16px,1fr))] sm:grid-cols-[repeat(48,minmax(20px,1fr))] md:grid-cols-[repeat(48,minmax(24px,1fr))] gap-0.5 min-w-[768px] sm:min-w-[960px] md:min-w-[1152px]">
                {hourBoxes.map((h) => {
                  const hour12 = ((h + 11) % 12) + 1;
                  const ampm = h < 12 ? "AM" : "PM";
                  return (
                    <div key={h} className="col-span-2 text-center select-none">
                      <span className="text-[12px] font-semibold">{hour12}</span>
                      <span className="ml-1 text-[10px] text-muted-foreground">{ampm}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* شريط التوافر كل 30 دقيقة */}
            <div className="mt-2 grid grid-cols-[repeat(48,minmax(16px,1fr))] sm:grid-cols-[repeat(48,minmax(20px,1fr))] md:grid-cols-[repeat(48,minmax(24px,1fr))] gap-0.5 min-w-[768px] sm:min-w-[960px] md:min-w-[1152px]">
              {isLoading
                ? Array.from({ length: 48 }).map((_, idx) => (
                    <div key={idx} className="h-6 md:h-8 animate-pulse rounded bg-muted" />
                  ))
                : getBlockStatus.map((status, idx) => (
                    <div
                      key={idx}
                      className={`h-6 md:h-8 rounded border transition-colors ${
                        status === "available"
                          ? "border-emerald-600/50 bg-emerald-500/80 hover:bg-emerald-500"
                          : status === "booked"
                          ? "border-rose-600/50 bg-rose-500/80 hover:bg-rose-500"
                          : "border-muted bg-muted"
                      }`}
                      title={`${formatBlockLabel(idx * 30)}`}
                    />
                  ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm bg-rose-500" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm bg-muted" />
              <span>None</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slots list */}
      <div className="rounded-xl border bg-card/50 shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-medium">Slots</div>
          <div className="text-xs text-muted-foreground">{filteredSlots.length} slots</div>
        </div>
        <div className="p-3">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">No slots for this day.</div>
          ) : (
            <div className="grid gap-2">
              {filteredSlots.map((slot) => {
                const isBooked = slot.isBooked;
                return (
                  <div
                    key={slot.id}
                    className="group flex items-center justify-between rounded-md border bg-background/60 p-3 transition-colors hover:bg-background"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        isBooked
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {isBooked ? "Booked" : "Available"}
                      </div>
                      <div className="text-sm">
                        {formatTime12(new Date(slot.startTime))} - {formatDateDMY(new Date(slot.startTime))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">→</div>
                    <div className="text-sm">
                      {formatTime12(new Date(slot.endTime))} - {formatDateDMY(new Date(slot.endTime))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrevSlots;
